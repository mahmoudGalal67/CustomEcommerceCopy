<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\category;
use App\Models\category_translation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CategoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $locale = $request->get('locale', 'en');
        $query = category::with([
            'translations'
        ]);

        if ($request->filled('search')) {

            $search = $request->search;

            $query->where(function ($q) use ($search, $locale) {

                $q->whereHas('translations', function ($t) use ($search, $locale) {

                    $t->where('locale', $locale)
                        ->where(function ($tt) use ($search) {

                            $tt->where('name', 'like', "%{$search}%");
                        });
                })
                    ->orWhere('id', 'like', "%{$search}%");
            });
        }

        return $query->get();
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $user = $request->user();
        $validated = $request->validate([
            // ✅ Translations optional
            'translations' => 'required|array',
            'translations.*.locale' => 'required_with:translations|string|max:20',
            'translations.*.name' => 'required_with:translations|string|max:50',
            'slug' => 'required|string',
            'icon' => 'nullable|file|mimes:jpg,jpeg,png,svg,webp|max:2048',
        ]);
        $path = null;
        if ($request->hasFile('icon')) {
            $path = $request->file('icon')->store('uploads', 'public');
            $validated['icon'] = $path;
        }
        $Category = category::create($validated + ['seller_id' => $user->seller->id]);
        foreach ($request->translations as $translationsData) {

            category_translation::create(
                [
                    'category_id' => $Category->id,
                    'locale' => $translationsData['locale'],
                    'name' => $translationsData['name'],
                    'icon' => $path,
                ]
            );
        }
        return response()->json([
            'message' => 'Category created successfully',
            'Category' => $Category,
        ], 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $category = Category::with('translations')->findOrFail($id);

        if (!$category) {
            return response()->json(['message' => 'Color not found'], 404);
        }

        return response()->json($category);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $category = Category::with('translations')->findOrFail($id);

        $validated = $request->validate([
            'slug' => 'required|string|max:255|unique:categories,slug,' . $id,
            'description' => 'nullable|string',

            'translations' => 'required|array|min:1',
            'translations.*.locale' => 'required|string',
            'translations.*.name' => 'required|string|max:255',

            'icon' => 'nullable|image|mimes:jpg,jpeg,png,webp,svg|max:2048',
        ]);

        // Update category fields
        $category->update([
            'slug' => $validated['slug'],
            // 'description' => $validated['description'] ?? null,
        ]);

        // Upload new icon if provided
        if ($request->hasFile('icon')) {

            // Delete old icon
            if ($category->icon && Storage::disk('public')->exists($category->icon)) {
                Storage::disk('public')->delete($category->icon);
            }

            $iconPath = $request->file('icon')->store(
                'categories/icons',
                'public'
            );

            $category->update([
                'icon' => $iconPath,
            ]);
        }

        // Update translations
        foreach ($validated['translations'] as $translation) {

            $category->translations()->updateOrCreate(
                [
                    'locale' => $translation['locale'],
                ],
                [
                    'name' => $translation['name'],
                ]
            );
        }

        return response()->json([
            'success' => true,
            'message' => 'Category updated successfully.',
            'data' => $category->fresh('translations'),
        ]);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Request $request)
    {
        $validated = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:categories,id',
        ]);

        $category = category::whereIn('id', $validated['ids'])->get();

        foreach ($category as $c) {
            $c->delete();
        }

        return response()->json([
            'message' => 'Category deleted successfully',
        ]);
    }
}

<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Page;
use Illuminate\Support\Str;

class PageController extends Controller
{
    // GET /api/pages
    public function index()
    {
        return Page::all();
    }
    public function indexLinks()
    {
        return Page::select('id', 'title', 'slug')->get();
    }

    // GET /api/pages/{slug}
    public function show($id)
    {
      return Page::where('id', $id)->firstOrFail();
    }

    // POST /api/pages
    public function store(Request $request)
    {
        $page = Page::where('title', $request->title)->firstOrFail();
        $validated = $request->validate([
            'title' => 'required|array',
            'title.en' => 'required|string',
            'title.ar' => 'nullable|string',

            'slug' => 'nullable|unique:pages,slug',
            'sections' => 'required|array',
        ]);
        // Auto-generate slug if null
        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']['en']);
        }
        $page->update($validated);

        return $page;
    }

    // PUT /api/pages/{slug}
    public function update(Request $request, $id)
    {
           $page = Page::firstOrCreate([ 'id' => $id ]);

        $validated = $request->validate([
            'title' => 'sometimes|array',
            'title.en' => 'sometimes|string',
            'title.ar' => 'sometimes|nullable|string',

            'slug' => 'sometimes|nullable|string|unique:pages,slug,' . $id,

            'sections' => 'sometimes|array',
        ]);

        if (isset($validated['title'])) {
            $validated['title'] = array_merge(
                $page->title ?? [],
                $validated['title']
            );
        }

        if (
            empty($validated['slug']) &&
            isset($validated['title']['en'])
        ) {
            $validated['slug'] = Str::slug($validated['title']['en']);
        }
        $page->update($validated);

        return $page;
    }

    // DELETE /api/pages/{slug}
    public function destroy($slug)
    {
        Page::where('slug', $slug)->delete();
        return response()->noContent();
    }
}
<?php

namespace App\Http\Controllers;

use App\Http\Requests\UpdateFeatureRequest;
use App\Models\Feature;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Throwable;

class FeatureController extends Controller
{
    /**
     * Get store settings.
     */
    public function show()
    {
      $feature = Feature::first();

if (!$feature) {
    $feature = Feature::create([
        'data' => Feature::defaults(),
    ]);
}

        // Include defaults for settings introduced in future versions.
        $data = array_merge(
            Feature::defaults(),
            $feature->data ?? []
        );

        return response()->json($data);
    }

    /**
     * Update store settings.
     */
    public function update(UpdateFeatureRequest $request)
    {
 $feature = Feature::first();

if (!$feature) {
    $feature = Feature::create([
        'data' => Feature::defaults(),
    ]);
}
        $existing = array_merge(
            Feature::defaults(),
            $feature->data ?? []
        );

        $data = $request->validated();

        $imageFields = [
            'background_image',
            'store_logo',
            'favicon',
        ];

        $newFiles = [];
        $oldFiles = [];

        try {
            /*
            |--------------------------------------------------------------------------
            | Upload images
            |--------------------------------------------------------------------------
            */

            foreach ($imageFields as $field) {
                if (!$request->hasFile($field)) {
                    continue;
                }

                $oldFiles[$field] = $existing[$field] ?? null;

                $path = $request->file($field)->store(
                    'features',
                    'public'
                );

                $newFiles[] = $path;

                $data[$field] = "/storage/{$path}";
            }

            /*
            |--------------------------------------------------------------------------
            | Merge existing settings with submitted settings
            |--------------------------------------------------------------------------
            */

            $updatedData = array_merge($existing, $data);

            $feature->data = $updatedData;
            $feature->save();

        } catch (Throwable $e) {

            // Remove newly uploaded files if saving failed.
            foreach ($newFiles as $path) {
                Storage::disk('public')->delete($path);
            }

            throw $e;
        }

        /*
        |--------------------------------------------------------------------------
        | Delete old images after successful database update
        |--------------------------------------------------------------------------
        */

        foreach ($oldFiles as $oldFile) {
            $this->deleteFeatureImage($oldFile);
        }

        return response()->json([
            'success' => true,
            'message' => 'Settings updated successfully.',
            'data' => $feature->data,
        ]);
    }

    /**
     * Delete an old image safely.
     */
    private function deleteFeatureImage(?string $url): void
    {
        if (!$url || !str_starts_with($url, '/storage/')) {
            return;
        }

        $path = Str::after($url, '/storage/');

        // Only delete files belonging to the features directory.
        if (!str_starts_with($path, 'features/')) {
            return;
        }

        Storage::disk('public')->delete($path);
    }
}
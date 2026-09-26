<?php

namespace App\Http\Controllers;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class SettingController extends Controller
{
    public function show()
    {
        return Setting::first();
    }

    public function update(Request $request)
    {
        /*
        |--------------------------------------------------------------------------
        | Decode JSON fields
        |--------------------------------------------------------------------------
        */

        if ($request->has('colors') && is_string($request->colors)) {
            $decoded = json_decode($request->colors, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                $request->merge([
                    'colors' => $decoded,
                ]);
            }
        }

        if ($request->has('info') && is_string($request->info)) {
            $decoded = json_decode($request->info, true);

            if (json_last_error() === JSON_ERROR_NONE) {
                $request->merge([
                    'info' => $decoded,
                ]);
            }
        }

        if ($request->has('terms') && is_string($request->terms)) {
    $decoded = json_decode($request->terms, true);

    if (json_last_error() === JSON_ERROR_NONE) {
        $request->merge([
            'terms' => $decoded,
        ]);
    }
}
        if ($request->has('privacy') && is_string($request->privacy)) {
    $decoded = json_decode($request->privacy, true);

    if (json_last_error() === JSON_ERROR_NONE) {
        $request->merge([
            'privacy' => $decoded,
        ]);
    }
}

        /*
        |--------------------------------------------------------------------------
        | Validate
        |--------------------------------------------------------------------------
        |
        | IMPORTANT:
        | Everything is nullable/optional.
        |
        | This means you can send only the fields you want to update.
        |
        */

        $data = $request->validate([
            'site_name' => 'sometimes|string|max:255',
            'site_description' => 'sometimes|nullable|string|max:255',
            'site_contact_phone' => 'string|max:20',
            'site_contact_email' => 'string|email',
            'site_location' => 'sometimes|string',

            'logo' => 'sometimes|nullable|image',
            'favicon' => 'sometimes|nullable|image',

            /*
            |--------------------------------------------------------------------------
            | Colors
            |--------------------------------------------------------------------------
            */

            'colors' => 'sometimes|array',
            'colors.primary' => 'sometimes|string|max:50',
            'colors.secondary' => 'sometimes|string|max:50',

            /*
            |--------------------------------------------------------------------------
            | Info
            |--------------------------------------------------------------------------
            */

  'info' => 'sometimes|array',

/*
|--------------------------------------------------------------------------
| About
|--------------------------------------------------------------------------
*/

'info.about' => 'sometimes|array',

'info.about.description' => 'sometimes|array',
'info.about.description.en' => 'sometimes|nullable|string',
'info.about.description.ar' => 'sometimes|nullable|string',

'info.about.story' => 'sometimes|array',
'info.about.story.en' => 'sometimes|nullable|string',
'info.about.story.ar' => 'sometimes|nullable|string',

/*
|--------------------------------------------------------------------------
| Terms
|--------------------------------------------------------------------------
*/

'terms' => 'sometimes|array',

'terms.*.icon' => 'required|string|max:100',

'terms.*.title' => 'required|array',
'terms.*.title.en' => 'sometimes|nullable|string|max:255',
'terms.*.title.ar' => 'sometimes|nullable|string|max:255',

'terms.*.description' => 'required|array',
'terms.*.description.en' => 'sometimes|nullable|string',
'terms.*.description.ar' => 'sometimes|nullable|string',
/*
|--------------------------------------------------------------------------
| Privacy
|--------------------------------------------------------------------------
*/

'privacy' => 'sometimes|array',

'privacy.*.icon' => 'required|string|max:100',

'privacy.*.title' => 'required|array',
'privacy.*.title.en' => 'sometimes|nullable|string|max:255',
'privacy.*.title.ar' => 'sometimes|nullable|string|max:255',

'privacy.*.description' => 'required|array',
'privacy.*.description.en' => 'sometimes|nullable|string',
'privacy.*.description.ar' => 'sometimes|nullable|string',

/*
|--------------------------------------------------------------------------
| Features
|--------------------------------------------------------------------------
*/

'info.features' => 'sometimes|array',

'info.features.*.title' => 'required|array',
'info.features.*.title.en' => 'sometimes|nullable|string|max:255',
'info.features.*.title.ar' => 'sometimes|nullable|string|max:255',

'info.features.*.description' => 'required|array',
'info.features.*.description.en' => 'sometimes|nullable|string',
'info.features.*.description.ar' => 'sometimes|nullable|string',

/*
|--------------------------------------------------------------------------
| Why Choose Us
|--------------------------------------------------------------------------
*/

'info.whyChooseUs' => 'sometimes|array',

'info.whyChooseUs.*.icon' => 'required|string|max:100',

'info.whyChooseUs.*.title' => 'required|array',
'info.whyChooseUs.*.title.en' => 'sometimes|nullable|string|max:255',
'info.whyChooseUs.*.title.ar' => 'sometimes|nullable|string|max:255',

'info.whyChooseUs.*.description' => 'required|array',
'info.whyChooseUs.*.description.en' => 'sometimes|nullable|string',
'info.whyChooseUs.*.description.ar' => 'sometimes|nullable|string',

/*
|--------------------------------------------------------------------------
| Shopping
|--------------------------------------------------------------------------
*/

'info.shopping' => 'sometimes|array',

'info.shopping.*.icon' => 'required|string|max:100',

'info.shopping.*.title' => 'required|array',
'info.shopping.*.title.en' => 'sometimes|nullable|string|max:255',
'info.shopping.*.title.ar' => 'sometimes|nullable|string|max:255',

'info.shopping.*.description' => 'required|array',
'info.shopping.*.description.en' => 'sometimes|nullable|string',
'info.shopping.*.description.ar' => 'sometimes|nullable|string',

            /*
            |--------------------------------------------------------------------------
            | Socials
            |--------------------------------------------------------------------------
            */

            'socials' => 'sometimes|array',
            'socials.*.name' => 'required|string',
            'socials.*.link' => 'required|url',
            'socials.*.logo' => 'nullable|image',
        ]);

        /*
        |--------------------------------------------------------------------------
        | Get or create settings
        |--------------------------------------------------------------------------
        */

        $setting = Setting::firstOrCreate([]);

        /*
        |--------------------------------------------------------------------------
        | LOGO
        |--------------------------------------------------------------------------
        |
        | Only replace the logo if a new logo was actually uploaded.
        |
        */

        if ($request->hasFile('logo')) {

            if (
                $setting->logo &&
                Storage::disk('public')->exists($setting->logo)
            ) {
                Storage::disk('public')->delete($setting->logo);
            }

            $data['logo'] = $request
                ->file('logo')
                ->store('uploads', 'public');
        }

        /*
        |--------------------------------------------------------------------------
        | FAVICON
        |--------------------------------------------------------------------------
        */

        if ($request->hasFile('favicon')) {

            if (
                $setting->favicon &&
                Storage::disk('public')->exists($setting->favicon)
            ) {
                Storage::disk('public')->delete($setting->favicon);
            }

            $data['favicon'] = $request
                ->file('favicon')
                ->store('uploads', 'public');
        }

        /*
        |--------------------------------------------------------------------------
        | COLORS
        |--------------------------------------------------------------------------
        |
        | Merge new colors with old colors.
        |
        | Example:
        |
        | Old:
        | {
        |     "primary": "#000000",
        |     "secondary": "#ffffff"
        | }
        |
        | Request:
        | {
        |     "primary": "#ff0000"
        | }
        |
        | Result:
        | {
        |     "primary": "#ff0000",
        |     "secondary": "#ffffff"
        | }
        |
        */

        if ($request->has('colors')) {

            $oldColors = $setting->colors ?? [];

            $data['colors'] = array_merge(
                $oldColors,
                $request->input('colors', [])
            );
        }

        /*
        |--------------------------------------------------------------------------
        | INFO
        |--------------------------------------------------------------------------
        |
        | Recursively merge the new info with the existing info.
        |
        */

        if ($request->has('info')) {

            $oldInfo = $setting->info ?? [];

            $newInfo = $request->input('info', []);

            $data['info'] = $this->mergeSettingsData(
                $oldInfo,
                $newInfo
            );
        }

        if ($request->has('terms')) {

    $data['terms'] = $request->input('terms', []);
}
        if ($request->has('privacy')) {

    $data['privacy'] = $request->input('privacy', []);
}

        /*
        |--------------------------------------------------------------------------
        | SOCIALS
        |--------------------------------------------------------------------------
        |
        | If socials are sent, replace the socials array with the new array.
        |
        | However, old social logos are preserved when a new logo
        | is not uploaded.
        |
        */

        if ($request->has('socials')) {

            $socials = [];

            $oldSocials = $setting->socials ?? [];

            foreach ($request->input('socials', []) as $index => $social) {

                /*
                |--------------------------------------------------------------------------
                | Social logo
                |--------------------------------------------------------------------------
                */

                if ($request->hasFile("socials.$index.logo")) {

                    /*
                    | Delete old logo if it exists
                    */

                    if (
                        isset($oldSocials[$index]['logo']) &&
                        $oldSocials[$index]['logo'] &&
                        Storage::disk('public')->exists(
                            $oldSocials[$index]['logo']
                        )
                    ) {
                        Storage::disk('public')->delete(
                            $oldSocials[$index]['logo']
                        );
                    }

                    /*
                    | Store new logo
                    */

                    $social['logo'] = $request
                        ->file("socials.$index.logo")
                        ->store('uploads', 'public');
                } else {

                    /*
                    | No new logo:
                    | keep the old logo
                    */

                    $social['logo'] =
                        $oldSocials[$index]['logo'] ?? null;
                }

                $socials[] = $social;
            }

            $data['socials'] = $socials;
        }

        /*
        |--------------------------------------------------------------------------
        | Update only the fields that were actually sent
        |--------------------------------------------------------------------------
        */

        $setting->update($data);

        /*
        |--------------------------------------------------------------------------
        | Return fresh data
        |--------------------------------------------------------------------------
        */

        return response()->json(
            $setting->fresh()
        );
    }

    /*
    |--------------------------------------------------------------------------
    | Recursive settings merge
    |--------------------------------------------------------------------------
    |
    | This allows partial updates to deeply nested JSON data.
    |
    */

    private function mergeSettingsData(
        array $old,
        array $new
    ): array {
        foreach ($new as $key => $value) {

            /*
            | If both old and new values are arrays,
            | recursively merge them.
            */

            if (
                isset($old[$key]) &&
                is_array($old[$key]) &&
                is_array($value)
            ) {
                /*
                | For indexed arrays such as:
                |
                | features
                | whyChooseUs
                | shopping
                |
                | we replace the entire array when it is sent.
                |
                | For associative arrays such as:
                |
                | about
                |
                | we recursively merge.
                */

                if ($this->isAssociativeArray($value)) {

                    $old[$key] = $this->mergeSettingsData(
                        $old[$key],
                        $value
                    );

                } else {

                    $old[$key] = $value;
                }

            } else {

                /*
                | Normal value:
                | overwrite old value.
                */

                $old[$key] = $value;
            }
        }

        return $old;
    }

    /*
    |--------------------------------------------------------------------------
    | Determine whether an array is associative
    |--------------------------------------------------------------------------
    */

    private function isAssociativeArray(array $array): bool
    {
        if ($array === []) {
            return false;
        }

        return array_keys($array) !== range(0, count($array) - 1);
    }
}

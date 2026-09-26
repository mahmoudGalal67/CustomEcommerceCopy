<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\PopupCampaign;
use Illuminate\Http\Request;

class PopupCampaignController extends Controller
{
    public function show()
    {
        return PopupCampaign::first();
    }


   public function update(Request $request)
{
    $campaign = PopupCampaign::firstOrCreate([], [
        'title' => 'best popup campaign',
    ]);

    $data = $request->except('image');

    // FormData sends boolean values as strings
    $data['enabled'] = filter_var(
        $request->input('enabled'),
        FILTER_VALIDATE_BOOLEAN
    );

    if ($request->hasFile('image')) {
        $path = $request->file('image')->store(
            'uploads',
            'public'
        );

        $data['image'] = $path;
    }

    $campaign->update($data);

    return response()->json($campaign);
}

}

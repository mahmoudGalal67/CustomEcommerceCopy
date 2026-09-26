<?php

namespace App\Http\Controllers;

use App\Models\AnnouncementBar;
use Illuminate\Http\Request;

class AnnouncementBarController extends Controller
{
    public function show()
    {
        $bar = AnnouncementBar::firstOrCreate([], ['message' => ['en' => 'Special Offer: Get 20% off on all products! Limited time only.', 'ar' => 'عرض خاص: احصل على خصم 20٪ على جميع المنتجات! لفترة محدودة فقط.',], 'enabled' => false, 'background_color' => '#000000', 'text_color' => '#FFFFFF', 'speed' => 50,]);
        return response()->json($bar);
    }
    public function update(Request $request)
    {
        $bar = AnnouncementBar::firstOrCreate([], ['message' => ['en' => '', 'ar' => '',], 'enabled' => false, 'background_color' => '#000000', 'text_color' => '#FFFFFF', 'speed' => 50,]);
        $bar->update($request->all());
        return response()->json($bar);
    }
}

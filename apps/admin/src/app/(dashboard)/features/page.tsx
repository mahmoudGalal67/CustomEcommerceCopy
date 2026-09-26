"use client";

import SettingsForm from "@/components/settings/SettingsForm";

export default function SettingsPage() {
    return (
        <div className="mx-auto p-6">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">
                    Store Settings
                </h1>

                <p className="text-muted-foreground">
                    Manage your store configuration
                </p>
            </div>

            <SettingsForm />
        </div>
    );
}
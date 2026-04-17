"use client";

import { ExpoAccountSection } from "@/components/settings/expo-account-section";
import { AccountSection } from "@/components/settings/account-section";

export default function SettingsPage() {
  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-text-primary">Settings</h1>
        <p className="text-sm text-text-muted mt-1">
          Manage your account, linked services, and build credentials.
        </p>
      </div>

      <div className="space-y-6">
        <AccountSection />
        <ExpoAccountSection />
      </div>
    </div>
  );
}

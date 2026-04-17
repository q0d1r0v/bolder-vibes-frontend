/**
 * Pixel-accurate device specs. Every dimension here is the real physical
 * pt value as reported by Apple / Google (1 pt === 1 CSS px @ 1×), so the
 * DeviceFrame component can reproduce bezels, corner radii, notches and
 * hardware buttons exactly. The frame component scales everything
 * uniformly to fit the preview column, preserving every proportion.
 *
 * References:
 *  - iPhone: Apple Human Interface Guidelines / developer.apple.com
 *  - Pixel: Google's device emulator spec sheets
 *  - Galaxy S24: Samsung's official display datasheet
 *  - iPad: Apple Developer — iPad device sizes
 */

export type DeviceGroup = "iOS" | "Android" | "Tablet";
export type NotchType = "dynamicIsland" | "notch" | "punchHole" | "none";
export type ButtonKind = "power" | "volume" | "silent" | "action";

export interface DeviceButton {
  side: "left" | "right";
  /** Distance from the top edge of the device body, in pt. */
  top: number;
  /** Button length along the side, in pt. */
  length: number;
  kind: ButtonKind;
}

export interface DevicePreset {
  id: string;
  name: string;
  group: DeviceGroup;

  /** Physical device body dimensions in pt (== CSS px at 1×). */
  width: number;
  height: number;

  /** Bezel thickness around the display, in pt. */
  bezelTop: number;
  bezelBottom: number;
  bezelSide: number;

  /** Outer chassis corner radius (pt). */
  frameRadius: number;
  /** Inner display corner radius (pt). */
  screenRadius: number;

  /** Camera/notch treatment. */
  notchType: NotchType;
  /** Island / notch / punch-hole geometry (all in pt, relative to top of display). */
  cameraCutout?: {
    width: number;
    height: number;
    /** Distance from top edge of the SCREEN (not the body). */
    topInset: number;
  };

  /** iOS-style swipe-up pill at the bottom of the screen. */
  hasHomeIndicator: boolean;
  /** Physical home button (iPhone SE). */
  hasHomeButton: boolean;

  /** Side rocker / power buttons. Rendered as slight chassis protrusions. */
  buttons: DeviceButton[];

  /** Chassis body colour. */
  chassisColor: string;
  /** Thin inner bezel highlight colour (between body and screen). */
  innerRingColor: string;
}

// ─── iOS ────────────────────────────────────────────────
const IPHONE_15: DevicePreset = {
  id: "iphone-15",
  name: "iPhone 15",
  group: "iOS",
  width: 393,
  height: 852,
  bezelTop: 11,
  bezelBottom: 11,
  bezelSide: 10,
  frameRadius: 55,
  screenRadius: 44,
  notchType: "dynamicIsland",
  cameraCutout: { width: 120, height: 37, topInset: 11 },
  hasHomeIndicator: true,
  hasHomeButton: false,
  buttons: [
    { side: "left", top: 92, length: 28, kind: "action" },
    { side: "left", top: 140, length: 62, kind: "volume" },
    { side: "left", top: 218, length: 62, kind: "volume" },
    { side: "right", top: 178, length: 102, kind: "power" },
  ],
  chassisColor: "#1c1c1e",
  innerRingColor: "#0a0a0c",
};

const IPHONE_15_PRO_MAX: DevicePreset = {
  id: "iphone-15-pro-max",
  name: "iPhone 15 Pro Max",
  group: "iOS",
  width: 430,
  height: 932,
  bezelTop: 11,
  bezelBottom: 11,
  bezelSide: 10,
  frameRadius: 55,
  screenRadius: 44,
  notchType: "dynamicIsland",
  cameraCutout: { width: 120, height: 37, topInset: 11 },
  hasHomeIndicator: true,
  hasHomeButton: false,
  buttons: [
    { side: "left", top: 92, length: 28, kind: "action" },
    { side: "left", top: 140, length: 62, kind: "volume" },
    { side: "left", top: 218, length: 62, kind: "volume" },
    { side: "right", top: 178, length: 102, kind: "power" },
  ],
  chassisColor: "#403e3b",
  innerRingColor: "#0a0a0c",
};

const IPHONE_SE: DevicePreset = {
  id: "iphone-se",
  name: "iPhone SE",
  group: "iOS",
  width: 375,
  height: 667,
  bezelTop: 85,
  bezelBottom: 110,
  bezelSide: 12,
  frameRadius: 42,
  screenRadius: 2,
  notchType: "none",
  hasHomeIndicator: false,
  hasHomeButton: true,
  buttons: [
    { side: "left", top: 120, length: 56, kind: "volume" },
    { side: "left", top: 190, length: 56, kind: "volume" },
    { side: "right", top: 140, length: 68, kind: "power" },
  ],
  chassisColor: "#1c1c1e",
  innerRingColor: "#0a0a0c",
};

// ─── Android ────────────────────────────────────────────
const PIXEL_8: DevicePreset = {
  id: "pixel-8",
  name: "Pixel 8",
  group: "Android",
  width: 412,
  height: 915,
  bezelTop: 10,
  bezelBottom: 10,
  bezelSide: 9,
  frameRadius: 40,
  screenRadius: 32,
  notchType: "punchHole",
  cameraCutout: { width: 14, height: 14, topInset: 10 },
  hasHomeIndicator: false,
  hasHomeButton: false,
  buttons: [
    { side: "right", top: 170, length: 68, kind: "power" },
    { side: "right", top: 250, length: 108, kind: "volume" },
  ],
  chassisColor: "#2a2a2c",
  innerRingColor: "#0a0a0c",
};

const GALAXY_S24: DevicePreset = {
  id: "galaxy-s24",
  name: "Galaxy S24",
  group: "Android",
  width: 384,
  height: 832,
  bezelTop: 7,
  bezelBottom: 7,
  bezelSide: 6,
  frameRadius: 32,
  screenRadius: 26,
  notchType: "punchHole",
  cameraCutout: { width: 12, height: 12, topInset: 12 },
  hasHomeIndicator: false,
  hasHomeButton: false,
  buttons: [
    { side: "right", top: 170, length: 60, kind: "power" },
    { side: "right", top: 245, length: 100, kind: "volume" },
  ],
  chassisColor: "#1f2022",
  innerRingColor: "#0a0a0c",
};

// ─── Tablets ────────────────────────────────────────────
const IPAD_MINI: DevicePreset = {
  id: "ipad-mini",
  name: "iPad Mini",
  group: "Tablet",
  width: 744,
  height: 1133,
  bezelTop: 20,
  bezelBottom: 20,
  bezelSide: 20,
  frameRadius: 32,
  screenRadius: 18,
  notchType: "none",
  hasHomeIndicator: true,
  hasHomeButton: false,
  buttons: [
    { side: "right", top: 120, length: 38, kind: "power" },
    { side: "left", top: 140, length: 50, kind: "volume" },
    { side: "left", top: 210, length: 50, kind: "volume" },
  ],
  chassisColor: "#a9a9a9",
  innerRingColor: "#0a0a0c",
};

const IPAD_PRO_11: DevicePreset = {
  id: "ipad-pro",
  name: 'iPad Pro 11"',
  group: "Tablet",
  width: 834,
  height: 1194,
  bezelTop: 22,
  bezelBottom: 22,
  bezelSide: 22,
  frameRadius: 36,
  screenRadius: 20,
  notchType: "none",
  hasHomeIndicator: true,
  hasHomeButton: false,
  buttons: [
    { side: "right", top: 100, length: 44, kind: "power" },
    { side: "left", top: 130, length: 58, kind: "volume" },
    { side: "left", top: 210, length: 58, kind: "volume" },
  ],
  chassisColor: "#8c8c8c",
  innerRingColor: "#0a0a0c",
};

export const DEVICE_PRESETS: DevicePreset[] = [
  IPHONE_15,
  IPHONE_15_PRO_MAX,
  IPHONE_SE,
  PIXEL_8,
  GALAXY_S24,
  IPAD_MINI,
  IPAD_PRO_11,
];

export const DEFAULT_DEVICE_ID = "iphone-15";

const STORAGE_KEY = "bv-preview-device";

export function loadDeviceId(): string {
  if (typeof window === "undefined") return DEFAULT_DEVICE_ID;
  return localStorage.getItem(STORAGE_KEY) || DEFAULT_DEVICE_ID;
}

export function saveDeviceId(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, id);
}

export function getPreset(id: string): DevicePreset {
  return DEVICE_PRESETS.find((d) => d.id === id) ?? DEVICE_PRESETS[0];
}

"use client";

import { useLayoutEffect, useRef, useState } from "react";
import type { DeviceButton, DevicePreset } from "./device-presets";

interface DeviceFrameProps {
  preset: DevicePreset;
  children: React.ReactNode;
}

/** Pixels of horizontal and vertical breathing room around the device
 *  inside the preview column. Side-button protrusions need a bit of
 *  extra room on the left/right so they don't clip at the column edge. */
const MARGIN_X = 14;
const MARGIN_Y = 16;

/** How far a hardware button sticks out from the chassis edge, in pt. */
const BUTTON_PROTRUSION = 2;

/**
 * Renders a pixel-accurate mock of the selected device with the child
 * content (typically an iframe) placed on the "screen" layer. Everything
 * is modelled in real pt — the outer wrapper computes a single uniform
 * scale factor so every bezel, corner radius and hardware button stays
 * in its correct physical proportion.
 */
export function DeviceFrame({ preset, children }: DeviceFrameProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useLayoutEffect(() => {
    const measure = () => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const availableW = Math.max(rect.width - MARGIN_X * 2, 0);
      const availableH = Math.max(rect.height - MARGIN_Y * 2, 0);
      if (availableW <= 0 || availableH <= 0) return;
      const bodyW = preset.width + BUTTON_PROTRUSION * 2; // account for protrusions
      const bodyH = preset.height;
      const s = Math.min(availableW / bodyW, availableH / bodyH, 1);
      setScale(s > 0 ? s : 1);
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (containerRef.current) ro.observe(containerRef.current);
    return () => ro.disconnect();
  }, [preset]);

  const scaledW = (preset.width + BUTTON_PROTRUSION * 2) * scale;
  const scaledH = preset.height * scale;

  const screenW = preset.width - preset.bezelSide * 2;
  const screenH = preset.height - preset.bezelTop - preset.bezelBottom;

  return (
    <div
      ref={containerRef}
      className="w-full h-full flex items-center justify-center"
    >
      <div
        style={{
          width: scaledW,
          height: scaledH,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: preset.width + BUTTON_PROTRUSION * 2,
            height: preset.height,
            transform: `scale(${scale})`,
            transformOrigin: "top left",
          }}
        >
          {/* Side buttons — rendered outside the chassis body so they
              look like physical protrusions of the real device. Drawn
              FIRST so the chassis sits on top and hides the stubs. */}
          {preset.buttons.map((btn, idx) => (
            <SideButton
              key={idx}
              button={btn}
              chassisColor={preset.chassisColor}
            />
          ))}

          {/* Chassis body */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: BUTTON_PROTRUSION,
              width: preset.width,
              height: preset.height,
              borderRadius: preset.frameRadius,
              background: preset.chassisColor,
              // Outer highlight + inner shadow give the chassis depth.
              boxShadow: [
                "inset 0 1px 0 rgba(255,255,255,0.06)",
                "inset 0 -1px 0 rgba(0,0,0,0.4)",
                "0 1px 0 rgba(255,255,255,0.05)",
                "0 24px 48px -18px rgba(0,0,0,0.55)",
              ].join(", "),
            }}
          >
            {/* Inner ring — the thin black gasket between metal body
                and the display glass. */}
            <div
              style={{
                position: "absolute",
                top: preset.bezelTop - 2,
                left: preset.bezelSide - 2,
                width: screenW + 4,
                height: screenH + 4,
                borderRadius: preset.screenRadius + 2,
                background: preset.innerRingColor,
              }}
            />

            {/* Screen (where the iframe goes) */}
            <div
              style={{
                position: "absolute",
                top: preset.bezelTop,
                left: preset.bezelSide,
                width: screenW,
                height: screenH,
                borderRadius: preset.screenRadius,
                overflow: "hidden",
                background: "#000",
              }}
            >
              {children}

              {/* Cutout overlays sit ON TOP of the screen so they stay
                  visible even when the iframe scrolls. */}
              {preset.notchType === "dynamicIsland" && preset.cameraCutout && (
                <DynamicIsland
                  cutout={preset.cameraCutout}
                  screenW={screenW}
                />
              )}
              {preset.notchType === "notch" && preset.cameraCutout && (
                <Notch cutout={preset.cameraCutout} screenW={screenW} />
              )}
              {preset.notchType === "punchHole" && preset.cameraCutout && (
                <PunchHole cutout={preset.cameraCutout} screenW={screenW} />
              )}

              {/* Home indicator pill */}
              {preset.hasHomeIndicator && (
                <div
                  style={{
                    position: "absolute",
                    left: "50%",
                    bottom: 8,
                    transform: "translateX(-50%)",
                    width: Math.min(screenW * 0.35, 134),
                    height: 5,
                    borderRadius: 3,
                    background: "rgba(255,255,255,0.65)",
                    mixBlendMode: "difference",
                    pointerEvents: "none",
                  }}
                />
              )}
            </div>

            {/* iPhone SE physical home button */}
            {preset.hasHomeButton && (
              <div
                style={{
                  position: "absolute",
                  bottom: (preset.bezelBottom - 56) / 2,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: 56,
                  height: 56,
                  borderRadius: 56,
                  background:
                    "radial-gradient(circle at 50% 42%, #242426 0%, #111 65%, #050505 100%)",
                  boxShadow:
                    "inset 0 0 0 2px rgba(255,255,255,0.05), inset 0 -2px 4px rgba(0,0,0,0.5)",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    inset: 16,
                    borderRadius: 999,
                    border: "1.5px solid rgba(255,255,255,0.18)",
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function SideButton({
  button,
  chassisColor,
}: {
  button: DeviceButton;
  chassisColor: string;
}) {
  const isLeft = button.side === "left";
  return (
    <div
      style={{
        position: "absolute",
        top: button.top,
        [isLeft ? "left" : "right"]: 0,
        width: BUTTON_PROTRUSION + 1, // +1 so the button tucks under the chassis
        height: button.length,
        background: chassisColor,
        borderTopLeftRadius: isLeft ? 1 : 2,
        borderBottomLeftRadius: isLeft ? 1 : 2,
        borderTopRightRadius: isLeft ? 2 : 1,
        borderBottomRightRadius: isLeft ? 2 : 1,
        boxShadow: isLeft
          ? "inset 1px 0 0 rgba(255,255,255,0.06), inset -1px 0 0 rgba(0,0,0,0.4)"
          : "inset -1px 0 0 rgba(255,255,255,0.06), inset 1px 0 0 rgba(0,0,0,0.4)",
      }}
    />
  );
}

function DynamicIsland({
  cutout,
  screenW,
}: {
  cutout: NonNullable<DevicePreset["cameraCutout"]>;
  screenW: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: cutout.topInset,
        left: (screenW - cutout.width) / 2,
        width: cutout.width,
        height: cutout.height,
        borderRadius: cutout.height,
        background: "#000",
        boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.04)",
        pointerEvents: "none",
      }}
    />
  );
}

function Notch({
  cutout,
  screenW,
}: {
  cutout: NonNullable<DevicePreset["cameraCutout"]>;
  screenW: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: 0,
        left: (screenW - cutout.width) / 2,
        width: cutout.width,
        height: cutout.height + cutout.topInset,
        background: "#000",
        borderBottomLeftRadius: 18,
        borderBottomRightRadius: 18,
        pointerEvents: "none",
      }}
    />
  );
}

function PunchHole({
  cutout,
  screenW,
}: {
  cutout: NonNullable<DevicePreset["cameraCutout"]>;
  screenW: number;
}) {
  return (
    <div
      style={{
        position: "absolute",
        top: cutout.topInset,
        left: (screenW - cutout.width) / 2,
        width: cutout.width,
        height: cutout.height,
        borderRadius: cutout.width,
        background: "#000",
        boxShadow: "inset 0 0 0 1.5px rgba(255,255,255,0.05)",
        pointerEvents: "none",
      }}
    />
  );
}

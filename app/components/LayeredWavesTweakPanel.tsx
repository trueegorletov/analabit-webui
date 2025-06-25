"use client";

import React, { useState } from "react";
import AnimatedLayeredWaves from "./AnimatedLayeredWaves";

const defaultParams = [
  { color: "#ff9966", amplitude: 6, frequency: 0.7 },
  { color: "#fd827e", amplitude: 8, frequency: 0.8 },
  { color: "#ec7398", amplitude: 10, frequency: 0.9 },
  { color: "#cb6faf", amplitude: 12, frequency: 1.0 },
  { color: "#9c70bd", amplitude: 14, frequency: 1.1 },
  { color: "#5f72be", amplitude: 16, frequency: 1.2 },
];

export default function LayeredWavesTweakPanel() {
  const [params, setParams] = useState(defaultParams);
  const [speed, setSpeed] = useState(1);

  const handleParamChange = (idx: number, key: string, value: string | number) => {
    setParams((prev) =>
      prev.map((p, i) =>
        i === idx ? { ...p, [key]: value } : p
      )
    );
  };

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: 24 }}>
      <h2 style={{ textAlign: "center", marginBottom: 16 }}>Layered Waves Live Tweak Panel</h2>
      <div style={{ marginBottom: 24 }}>
        <label>
          <b>Global Speed:</b>
          <input
            type="range"
            min={0.1}
            max={3}
            step={0.01}
            value={speed}
            onChange={e => setSpeed(Number(e.target.value))}
            style={{ width: 200, marginLeft: 12 }}
          />
          <span style={{ marginLeft: 8 }}>{speed.toFixed(2)}x</span>
        </label>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 16, marginBottom: 32 }}>
        {params.map((p, idx) => (
          <div key={idx} style={{ border: "1px solid #333", borderRadius: 8, padding: 12, minWidth: 180 }}>
            <div><b>Layer {idx + 1}</b></div>
            <div style={{ margin: "8px 0" }}>
              <label>
                Color:
                <input
                  type="color"
                  value={p.color}
                  onChange={e => handleParamChange(idx, "color", e.target.value)}
                  style={{ marginLeft: 8 }}
                />
              </label>
            </div>
            <div style={{ margin: "8px 0" }}>
              <label>
                Amplitude:
                <input
                  type="range"
                  min={0}
                  max={30}
                  step={0.1}
                  value={p.amplitude}
                  onChange={e => handleParamChange(idx, "amplitude", Number(e.target.value))}
                  style={{ marginLeft: 8 }}
                />
                <span style={{ marginLeft: 8 }}>{p.amplitude}</span>
              </label>
            </div>
            <div style={{ margin: "8px 0" }}>
              <label>
                Frequency:
                <input
                  type="range"
                  min={0.1}
                  max={2}
                  step={0.01}
                  value={p.frequency}
                  onChange={e => handleParamChange(idx, "frequency", Number(e.target.value))}
                  style={{ marginLeft: 8 }}
                />
                <span style={{ marginLeft: 8 }}>{p.frequency}</span>
              </label>
            </div>
          </div>
        ))}
      </div>
      <div style={{ border: "2px solid #444", borderRadius: 16, background: "#181a20", padding: 16 }}>
        <AnimatedLayeredWaves params={params} speed={speed} />
      </div>
    </div>
  );
} 
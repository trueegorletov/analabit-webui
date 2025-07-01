export const vertexShader = `
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 mod289(vec4 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec4 permute(vec4 x) { return mod289(((x*34.0)+1.0)*x); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);
    vec3 i = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);
    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);
    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;
    i = mod289(i);
    vec4 p = permute(permute(permute(
        i.z + vec4(0.0, i1.z, i2.z, 1.0))
        + i.y + vec4(0.0, i1.y, i2.y, 1.0))
        + i.x + vec4(0.0, i1.x, i2.x, 1.0));
    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;
    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);
    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);
    vec4 x = x_ * ns.x + ns.yyyy;
    vec4 y = y_ * ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);
    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);
    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));
    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;
    vec3 p0 = vec3(a0.xy,h.x);
    vec3 p1 = vec3(a0.zw,h.y);
    vec3 p2 = vec3(a1.xy,h.z);
    vec3 p3 = vec3(a1.zw,h.w);
    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;
    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  uniform float u_time;
  uniform float u_amplitude;
  uniform float u_frequency;
  uniform float u_speed;
  uniform vec2 u_mouse;
  uniform float u_loading;
  uniform float u_error_mix_factor;

  varying vec3 v_normal;
  varying vec3 v_position;
  varying float v_noise;

  void main() {
    float time = u_time * u_speed;
    float displacement = snoise(position * u_frequency + time);

    // Add error jitter that fades in with the error color
    float error_jitter = snoise(position * 20.0 + time * 5.0) * u_error_mix_factor * 0.05;

    // High-frequency corruption displacement for error state (Plan C) – reduced intensity
    float corruption = snoise(position * 40.0 + time * 20.0) * u_error_mix_factor * 0.25;

    vec3 mouse_effect = vec3(u_mouse * 2.0, 0.0);
    float mouse_influence = snoise(position * 0.5 + mouse_effect);

    v_noise = snoise(position * u_frequency + time);
    vec3 newPosition = position + normal * (v_noise * u_amplitude + mouse_influence * 0.1 + error_jitter + corruption);

    // Subtle pixelation – mixes in when error occurs to emphasise glitch
    newPosition = mix(newPosition, floor(newPosition * 4.0) / 4.0, u_error_mix_factor);

    v_normal = normalize(normal);
    v_position = newPosition;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
  }
`;

export const fragmentShader = `
  uniform float u_time;
  uniform vec3 u_colorA;
  uniform vec3 u_colorB;
  uniform vec3 u_colorC;
  uniform float u_loading;
  uniform vec3 u_error_colorA;
  uniform vec3 u_error_colorB;
  uniform vec3 u_error_colorC;
  uniform float u_error_mix_factor;

  varying vec3 v_normal;
  varying vec3 v_position;
  varying float v_noise;

  void main() {
    vec3 view_dir = normalize(cameraPosition - v_position);
    float fresnel = 1.0 - dot(view_dir, v_normal);
    fresnel = pow(fresnel, 2.0);

    // Calculate normal color
    vec3 normal_color = mix(u_colorA, u_colorB, v_noise * 0.5 + 0.5);
    float normal_swirl = sin(dot(v_position.xy, vec2(5.0, 5.0)) + u_time * 0.5) * 0.5 + 0.5;
    normal_color = mix(normal_color, u_colorA, normal_swirl * 0.5);
    float normal_time_factor = sin(u_time * 0.5 + v_position.y * 2.0) * 0.5 + 0.5;
    normal_color = mix(normal_color, u_colorB, normal_time_factor * 0.3);
    normal_color = mix(normal_color, u_colorC, fresnel);

    // Calculate error color (using same logic, different colors)
    vec3 error_color = mix(u_error_colorA, u_error_colorB, v_noise * 0.5 + 0.5);
    float error_swirl = sin(dot(v_position.xy, vec2(5.0, 5.0)) + u_time * 0.5) * 0.5 + 0.5;
    error_color = mix(error_color, u_error_colorA, error_swirl * 0.5);
    float error_time_factor = sin(u_time * 0.5 + v_position.y * 2.0) * 0.5 + 0.5;
    error_color = mix(error_color, u_error_colorB, error_time_factor * 0.3);
    error_color = mix(error_color, u_error_colorC, fresnel);
    
    // Mix between normal and error colors
    vec3 final_color = mix(normal_color, error_color, u_error_mix_factor);

    // Loading shimmer – subtle brightness pulsing when u_loading > 0
    float shimmer = (sin(u_time * 6.0) * 0.5 + 0.5) * 0.2 * u_loading;
    
    // Error glow – similar white pulsing tied to error state
    float errorGlow = (sin(u_time * 8.0 + v_position.y * 3.0) * 0.5 + 0.5) * 0.25 * u_error_mix_factor;

    final_color += shimmer + errorGlow;

    gl_FragColor = vec4(final_color, 1.0);
  }
`; 
"use client"
import { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import ForgotPasswordModal from "./Components/FrogetPassword";
import { useRouter } from 'next/navigation';
import { useAuth } from "./context/AuthContext";

export default function MLMAuthComponent() {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '', // Fixed: was 'name' in initial state but 'name' in form
    phoneNumber: '',
    sponsorId: ''
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const frameRef = useRef(null);
  const [isVerifyingOTP, setIsVerifyingOTP] = useState(false);
  const [otp, setOtp] = useState("");
  const { setUserData } = useAuth();
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);
  const router = useRouter();

  const API_BASE_URL = "https://unilevel-mlm.onrender.com/api/auth"

  useEffect(() => {
    if (!mountRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x0a0a1a, 1);
    mountRef.current.appendChild(renderer.domElement);

    // Create network nodes
    const nodes = [];
    const connections = [];
    const nodeGeometry = new THREE.SphereGeometry(0.1, 8, 8);
    const nodeMaterial = new THREE.MeshBasicMaterial({ color: 0x667eea });

    // Generate random nodes
    for (let i = 0; i < 100; i++) {
      const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
      node.position.set(
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50,
        (Math.random() - 0.5) * 50
      );
      nodes.push(node);
      scene.add(node);
    }

    // Create connections between nearby nodes - Fixed: More efficient connection logic
    const lineMaterial = new THREE.LineBasicMaterial({ color: 0x667eea, opacity: 0.3, transparent: true });

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const distance = nodes[i].position.distanceTo(nodes[j].position);
        if (distance < 8) {
          const geometry = new THREE.BufferGeometry().setFromPoints([
            nodes[i].position,
            nodes[j].position
          ]);
          const line = new THREE.Line(geometry, lineMaterial);
          // Store node indices for easier updating
          line.userData = { nodeIndex1: i, nodeIndex2: j };
          connections.push(line);
          scene.add(line);
        }
      }
    }

    // Lighting
    const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0x667eea, 1, 100);
    pointLight.position.set(10, 10, 10);
    scene.add(pointLight);

    camera.position.z = 30;

    // Animation
    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);

      // Rotate the entire scene
      scene.rotation.x += 0.001;
      scene.rotation.y += 0.002;

      // Animate individual nodes
      nodes.forEach((node, index) => {
        node.position.x += Math.sin(Date.now() * 0.001 + index) * 0.01;
        node.position.y += Math.cos(Date.now() * 0.001 + index) * 0.01;
      });

      // Fixed: Update connections using stored node indices
      connections.forEach((line) => {
        const { nodeIndex1, nodeIndex2 } = line.userData;
        const positions = line.geometry.attributes.position;
        if (positions && nodes[nodeIndex1] && nodes[nodeIndex2]) {
          positions.setXYZ(0, nodes[nodeIndex1].position.x, nodes[nodeIndex1].position.y, nodes[nodeIndex1].position.z);
          positions.setXYZ(1, nodes[nodeIndex2].position.x, nodes[nodeIndex2].position.y, nodes[nodeIndex2].position.z);
          positions.needsUpdate = true;
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    // Handle resize
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };

    window.addEventListener('resize', handleResize);

    // Store refs for cleanup
    sceneRef.current = scene;
    rendererRef.current = renderer;

    return () => {
      window.removeEventListener('resize', handleResize);
      if (frameRef.current) {
        cancelAnimationFrame(frameRef.current);
      }
      if (mountRef.current && renderer.domElement && mountRef.current.contains(renderer.domElement)) {
        mountRef.current.removeChild(renderer.domElement);
      }
      // Fixed: Proper Three.js cleanup
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) object.material.dispose();
      });
      renderer.dispose();
    };
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      newErrors.password = 'Password must be at least 8 characters';
    }

    if (!isLogin) {
      if (!formData.name) {
        newErrors.name = 'Full name is required';
      }

      if (!formData.phoneNumber) {
        newErrors.phoneNumber = 'Phone number is required';
      } else if (!/^\+?[\d\s\-()]{10,}$/.test(formData.phoneNumber)) { // Fixed: escaped dash in regex
        newErrors.phoneNumber = 'Please enter a valid phone number';
      }

      if (!formData.confirmPassword) {
        newErrors.confirmPassword = 'Please confirm your password';
      } else if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async () => {
    if (!validateForm()) return;
    setIsLoading(true);

    try {
      if (isLogin) {
        // 🔹 LOGIN API
        const res = await fetch(`${API_BASE_URL}/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password
          }),
        });

        const data = await res.json();

        if (!res.ok) throw new Error(data.message || "Login failed");

        setUserData(data)
        console.log(data)
        alert("✅ Login Success!");
        localStorage.setItem("token", data.token);
        router.push('/Dashboard')


      } else {
        // 🔹 REGISTER API
        const res = await fetch(`${API_BASE_URL}/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Registration failed");

        alert("✅ OTP sent to email. Please verify.");
        setIsVerifyingOTP(true);
      }
    } catch (err) {
      alert(err.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!otp) return alert("Enter OTP");
    if (otp.length !== 6) return alert("OTP must be 6 digits");

    setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE_URL}/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          otp: otp,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "OTP Verification failed");

      alert("✅ Email Verified! Please login now.");
      setIsVerifyingOTP(false);
      setIsLogin(true);

      // Clear form after verification
      setFormData({
        email: "",
        password: "",
        confirmPassword: "",
        name: "",
        phoneNumber: "",
        sponsorId: ""
      });
      setOtp("");
    } catch (err) {
      alert(err.message || "Verification failed");
    } finally {
      setIsLoading(false);
    }
  };


  const toggleMode = () => {
    setIsLogin(!isLogin);
    setFormData({
      email: '',
      password: '',
      confirmPassword: '',
      name: '',
      phoneNumber: '',
      sponsorId: ''
    });
    setErrors({});
    setIsVerifyingOTP(false); // Fixed: Reset OTP verification state
    setOtp(''); // Fixed: Clear OTP
  };

  return (
    <>
      {isVerifyingOTP ? (
        <div className="relative min-h-screen overflow-hidden">
          {/* Custom 3D Network Background */}
          <div ref={mountRef} className="fixed inset-0 z-0" />

          {/* Overlay for better text readability */}
          <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 z-10" />

          {/* OTP Verification Content */}
          <div className="relative z-20 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl shadow-2xl p-8 border border-white/10">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
                  <p className="text-gray-300 text-sm">
                    We've sent a 6-digit code to your email
                  </p>
                </div>

                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Enter OTP sent to {formData.email}
                    </label>
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} // Fixed: Only allow digits and limit to 6
                      className="w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300 text-center text-2xl tracking-widest"
                      placeholder="000000"
                      maxLength={6}
                    />
                  </div>

                  <button
                    onClick={handleVerifyOTP}
                    disabled={isLoading || otp.length !== 6}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Verifying...
                      </div>
                    ) : (
                      "Verify OTP"
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      onClick={() => {
                        setIsVerifyingOTP(false);
                        setOtp('');
                      }}
                      className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                    >
                      Back to Registration
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative min-h-screen overflow-hidden">
          {/* Custom 3D Network Background */}
          <div ref={mountRef} className="fixed inset-0 z-0" />

          {/* Overlay for better text readability */}
          <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-indigo-900/20 z-10" />

          {/* Content */}
          <div className="relative z-20 min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
              {/* Glass Card */}
              <div className="backdrop-blur-xl bg-white/5 rounded-3xl shadow-2xl p-8 border border-white/10">

                {/* Header */}
                <div className="text-center mb-8">
                  <div className="mb-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent">
                      MLM Network
                    </h1>
                    <p className="text-sm text-gray-300 mt-2">Build Your Empire Together</p>
                  </div>

                  <h2 className="text-2xl font-bold text-white mb-2">
                    {isLogin ? 'Welcome Back, Partner!' : 'Join Our Network'}
                  </h2>
                  <p className="text-gray-300 text-sm">
                    {isLogin
                      ? 'Continue building your success story'
                      : 'Start your journey to financial freedom'
                    }
                  </p>
                </div>

                {/* Form */}
                <div className="space-y-6">
                  {!isLogin && (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Full Name *
                        </label>
                        <input
                          name="name"
                          type="text"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border ${errors.name ? 'border-red-400' : 'border-white/20'
                            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                          placeholder="Enter your full name"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-400">{errors.name}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Phone Number *
                        </label>
                        <input
                          name="phoneNumber"
                          type="tel"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border ${errors.phoneNumber ? 'border-red-400' : 'border-white/20'
                            } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                          placeholder="Enter your phone number"
                        />
                        {errors.phoneNumber && <p className="mt-1 text-sm text-red-400">{errors.phoneNumber}</p>}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Sponsor ID (Optional)
                        </label>
                        <input
                          name="sponsorId"
                          type="text"
                          value={formData.sponsorId}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                          placeholder="Enter sponsor ID (if referred)"
                        />
                      </div>
                    </>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Email Address *
                    </label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border ${errors.email ? 'border-red-400' : 'border-white/20'
                        } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your email address"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-400">{errors.email}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-200 mb-2">
                      Password *
                    </label>
                    <input
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border ${errors.password ? 'border-red-400' : 'border-white/20'
                        } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                      placeholder="Enter your password"
                    />
                    {errors.password && <p className="mt-1 text-sm text-red-400">{errors.password}</p>}
                  </div>

                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-200 mb-2">
                        Confirm Password *
                      </label>
                      <input
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleInputChange}
                        className={`w-full px-4 py-3 rounded-xl backdrop-blur-sm bg-white/5 border ${errors.confirmPassword ? 'border-red-400' : 'border-white/20'
                          } text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300`}
                        placeholder="Confirm your password"
                      />
                      {errors.confirmPassword && <p className="mt-1 text-sm text-red-400">{errors.confirmPassword}</p>}
                    </div>
                  )}

                  {isLogin && (
                    <div className="flex items-center justify-between text-sm">
                      <label className="flex items-center text-gray-300">
                        <input
                          type="checkbox"
                          className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white/20"
                        />
                        <span className="ml-2">Remember me</span>
                      </label>

                      <button
                        type="button"
                        onClick={() => setShowForgotPasswordModal(true)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Forgot password?
                      </button>

                      <ForgotPasswordModal
                        isOpen={showForgotPasswordModal}
                        onClose={() => setShowForgotPasswordModal(false)}
                        API_BASE_URL={API_BASE_URL}
                      />
                    </div>
                  )}

                  <button
                    onClick={handleSubmit}
                    disabled={isLoading}
                    className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        {isLogin ? 'Signing In...' : 'Creating Account...'}
                      </div>
                    ) : (
                      isLogin ? 'Sign In to Network' : 'Join the Network'
                    )}
                  </button>

                  <div className="text-center">
                    <p className="text-gray-300 text-sm">
                      {isLogin ? "New to our network? " : "Already part of our family? "}
                      <button
                        onClick={toggleMode}
                        className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
                      >
                        {isLogin ? 'Register Now' : 'Sign In'}
                      </button>
                    </p>
                  </div>

                  {!isLogin && (
                    <div className="bg-blue-500/10 border border-blue-400/20 rounded-lg p-4 mt-6">
                      <div className="flex items-start">
                        <div className="flex-shrink-0">
                          <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div className="ml-3 text-sm text-blue-200">
                          <p>
                            By registering, you agree to our Terms of Service and acknowledge that you understand our MLM business model and commission structure.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
"use client";
import React, { useState, useEffect, useRef } from "react";
import * as THREE from 'three';
import {
    BarChart3,
    Users,
    UserPlus,
    CreditCard,
    Wallet,
    Settings,
    Home,
    Bell,
    Search,
    Menu,
    X,
    TrendingUp,
    Copy,
    CheckCircle2,
    ArrowUpRight,
    DollarSign,
    Target,
    Award,
    Zap,
    Shield,
    LogOut,
    Upload,
    Bitcoin,
    Camera,
    FileImage,
    AlertCircle,
    Clock,
    CheckCircle
} from 'lucide-react';
import { useAuth } from "../context/AuthContext";
import { useRouter } from "next/navigation";

const ModernMLMDashboard = () => {
    const mountRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const frameRef = useRef(null);
    const fileInputRef = useRef(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [activeTab, setActiveTab] = useState('dashboard');
    const [notifications, setNotifications] = useState([
        { id: 1, message: "Welcome to your MLM Dashboard!", type: "success", read: false },
        { id: 2, message: "Your ROI has increased by $50 today", type: "info", read: false }
    ]);
    const [copiedField, setCopiedField] = useState(null);
    const [investmentAmount, setInvestmentAmount] = useState('');
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [uploadedFile, setUploadedFile] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showWithdrawalModal, setShowWithdrawalModal] = useState(false);
    const [withdrawalAmount, setWithdrawalAmount] = useState("");
    const [cryptoAddress, setCryptoAddress] = useState("");
    const [method, setMethod] = useState("USDT"); // default method
    const [referrals, setReferrals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [withdrawals, setWithdrawals] = useState([]);

    // Mock user data for demonstration

    const { userData } = useAuth();
    const router = useRouter();

    // Redirect if no user data (after hydration)
    useEffect(() => {
        if (userData === null) {
            router.push("/");
        }
    }, [userData, router]);

    // Prevent hydration error by rendering same thing on SSR & first client render
    if (!userData || !userData.user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-900 text-white">
                Loading...
            </div>
        );
    }

    const user = userData.user;
    // console.log(user);

    // Investment packages
    const investmentPackages = [
        {
            id: 1,
            name: "Starter Package",
            amount: 100,
            daily_roi: "2%",
            total_roi: "140%",
            duration: "70 days",
            color: "from-blue-500 to-cyan-500"
        },
        {
            id: 2,
            name: "Professional Package",
            amount: 500,
            daily_roi: "2.5%",
            total_roi: "175%",
            duration: "70 days",
            color: "from-purple-500 to-pink-500"
        },
        {
            id: 3,
            name: "Premium Package",
            amount: 1000,
            daily_roi: "3%",
            total_roi: "210%",
            duration: "70 days",
            color: "from-green-500 to-emerald-500"
        },
        {
            id: 4,
            name: "VIP Package",
            amount: 2500,
            daily_roi: "3.5%",
            total_roi: "245%",
            duration: "70 days",
            color: "from-orange-500 to-red-500"
        }
    ];

    // Admin crypto addresses (mock data)
    const adminAddresses = {
        bitcoin: "1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa",
        ethereum: "0x742b7fE9B8F0c7A5e8C9F0d2e3A4B5C6D7E8F9A0",
        usdt: "TQn9Y2khEsLJW1ChVWFMSMeRDow5KcbLSE"
    };

    // Navigation items with modern icons
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: Home, color: 'from-blue-500 to-cyan-500' },
        { id: 'invest', label: 'Invest', icon: TrendingUp, color: 'from-emerald-500 to-green-500' },
        { id: 'network', label: 'My Network', icon: Users, color: 'from-purple-500 to-pink-500' },
        { id: 'referrals', label: 'Referrals', icon: UserPlus, color: 'from-green-500 to-emerald-500' },
        { id: 'transactions', label: 'Transactions', icon: CreditCard, color: 'from-orange-500 to-red-500' },
        { id: 'wallet', label: 'Wallet', icon: Wallet, color: 'from-yellow-500 to-orange-500' },
        { id: 'settings', label: 'Settings', icon: Settings, color: 'from-gray-500 to-slate-500' },
    ];

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
        router.push("/");
    }

    // 3D Background Effect
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

        // Create connections between nearby nodes
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

            // Update connections
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
            const currentMount = mountRef.current;
            return () => {
                if (currentMount && renderer.domElement && currentMount.contains(renderer.domElement)) {
                    currentMount.removeChild(renderer.domElement);
                }
            };

            scene.traverse((object) => {
                if (object.geometry) object.geometry.dispose();
                if (object.material) object.material.dispose();
            });
            renderer.dispose();
        };
    }, []);

    const copyToClipboard = (text, field) => {
        navigator.clipboard.writeText(text);
        setCopiedField(field);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setUploadedFile(file);
        } else {
            alert('Please upload a valid image file');
        }
    };

    const handleInvestmentSubmit = async () => {
        if (!selectedPackage || !uploadedFile) {
            alert("Please select a package and upload payment screenshot");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append("userId", user.id);               // logged-in user ID
            formData.append("proofImage", uploadedFile);      // Multer expects proofImage

            const response = await fetch("https://unilevel-mlm.onrender.com/api/upload/upload", {
                method: "POST",
                body: formData, // no need to set Content-Type, browser handles it
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Something went wrong");
            }

            alert(data.message);

            // Reset states
            setSelectedPackage(null);
            setUploadedFile(null);
            setInvestmentAmount("");

        } catch (error) {
            console.error("Upload error:", error);
            alert(error.message);
        } finally {
            setIsSubmitting(false);
        }
    };


    // Withdraw function
    const handleWithdrawal = async () => {
        if (withdrawalAmount < 50) {
            alert("Minimum withdrawal is $50");
            return;
        }
        if (!cryptoAddress) {
            alert("Please enter your crypto address");
            return;
        }

        try {
            const res = await fetch("https://unilevel-mlm.onrender.com/api/withdrawal/create", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    user_id: user.id,
                    amount: withdrawalAmount,
                    address: cryptoAddress,
                    method
                }),
            });

            const data = await res.json();
            if (res.ok) {
                alert("Withdrawal request submitted!");
                setShowWithdrawalModal(false);
                setWithdrawalAmount("");
                setCryptoAddress("");
            } else {
                alert(data.message || "Something went wrong");
            }
        } catch (err) {
            console.error("Error:", err);
            alert("Server error, try again later");
        }
    };




    const [stats, setStats] = useState({
        total: 0,
        active: 0,
        thisMonth: 0,
    });

    const fetchReferrals = async () => {
        try {
            setLoading(true);
            const res = await fetch(`https://unilevel-mlm.onrender.com/api/auth/my-referrals/${user.id}`);
            const data = await res.json();

            if (!res.ok) throw new Error(data.message || "Failed to fetch referrals");

            const members = data.members || [];

            // Calculate stats
            const total = members.length;
            const active = members.filter((m) => m.investment > 0).length;
            const thisMonth = members.filter((m) => {
                const createdAt = new Date(m.createdAt || m.joinedAt);
                const now = new Date();
                return (
                    createdAt.getMonth() === now.getMonth() &&
                    createdAt.getFullYear() === now.getFullYear()
                );
            }).length;

            setReferrals(members);
            setStats({ total, active, thisMonth });
        } catch (error) {
            console.error("Referral fetch error:", error);
            setReferrals([]);
            setStats({ total: 0, active: 0, thisMonth: 0 });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (user?.id) fetchReferrals();
    }, [user, fetchReferrals]);


    const fetchUserWithdrawals = async () => {
        try {

            // console.log("Fetching user withdrawals...", user.id);
            const res = await fetch(`https://unilevel-mlm.onrender.com/api/withdrawal/user/${user.id}`);
            const data = await res.json();
            // console.log(data)
            if (res.ok) setWithdrawals(data);
        } catch (err) {
            console.error("Error fetching withdrawals:", err);
        }
    };

    useEffect(() => {
        if (user?.id)
            fetchUserWithdrawals();
    }, [user]);

    const StatCard = ({ title, value, icon: Icon, gradient, subtitle, trend }) => (
        <div className="group relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
            <div className="relative backdrop-blur-2xl bg-white/5 rounded-2xl p-6 border border-white/10 hover:border-white/20 transition-all duration-300 hover:scale-[1.02] hover:shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-xl bg-gradient-to-r ${gradient} shadow-lg`}>
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                    {trend && (
                        <div className="flex items-center text-green-400 text-sm font-medium">
                            <ArrowUpRight className="w-4 h-4 mr-1" />
                            +{trend}%
                        </div>
                    )}
                </div>
                <div className="space-y-2">
                    <p className="text-2xl font-bold text-white">{value}</p>
                    <p className="text-sm text-gray-400">{title}</p>
                    {subtitle && <p className="text-xs text-gray-500">{subtitle}</p>}
                </div>
            </div>
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'invest':
                return (
                    <div className="space-y-8">
                        <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    Investment Center
                                </h2>
                                <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-green-500/20 border border-green-400/30">
                                    <TrendingUp className="w-5 h-5 text-green-400" />
                                    <span className="text-green-400 font-medium">Active ROI: 2.5%/day</span>
                                </div>
                            </div>

                            {/* Investment Packages */}
                            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
                                {investmentPackages.map((pkg) => (
                                    <div
                                        key={pkg.id}
                                        onClick={() => {
                                            setSelectedPackage(pkg);
                                            setInvestmentAmount(pkg.amount.toString());
                                        }}
                                        className={`group relative cursor-pointer transition-all duration-300 ${selectedPackage?.id === pkg.id
                                            ? 'scale-105 ring-2 ring-blue-400 ring-opacity-50'
                                            : 'hover:scale-105'}`}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-r from-purple-600/20 to-blue-600/20 rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />
                                        <div className={`relative backdrop-blur-2xl bg-white/5 rounded-2xl p-6 border transition-all duration-300 ${selectedPackage?.id === pkg.id
                                            ? 'border-blue-400/50 bg-blue-500/10'
                                            : 'border-white/10 hover:border-white/20'}`}>
                                            <div className="text-center">
                                                <div className={`w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-r ${pkg.color} flex items-center justify-center`}>
                                                    <DollarSign className="w-8 h-8 text-white" />
                                                </div>
                                                <h3 className="text-xl font-bold text-white mb-2">{pkg.name}</h3>
                                                <div className="text-3xl font-bold text-green-400 mb-4">${pkg.amount}</div>

                                                <div className="space-y-2">
                                                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                                                        <span className="text-gray-300 text-sm">Daily ROI:</span>
                                                        <span className="text-green-400 font-semibold">{pkg.daily_roi}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                                                        <span className="text-gray-300 text-sm">Total ROI:</span>
                                                        <span className="text-blue-400 font-semibold">{pkg.total_roi}</span>
                                                    </div>
                                                    <div className="flex justify-between items-center p-2 rounded-lg bg-white/5">
                                                        <span className="text-gray-300 text-sm">Duration:</span>
                                                        <span className="text-purple-400 font-semibold">{pkg.duration}</span>
                                                    </div>
                                                </div>

                                                {selectedPackage?.id === pkg.id && (
                                                    <div className="mt-4 p-2 rounded-lg bg-blue-500/20 border border-blue-400/30">
                                                        <CheckCircle className="w-5 h-5 text-blue-400 mx-auto" />
                                                        <p className="text-blue-400 text-sm font-medium mt-1">Selected</p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Investment Form */}
                            {selectedPackage && (
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    {/* Payment Information */}
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-400/30">
                                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                                <Bitcoin className="w-6 h-6 mr-2 text-orange-400" />
                                                Admin Payment Addresses
                                            </h3>

                                            <div className="space-y-4">
                                                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-orange-400 font-semibold flex items-center">
                                                            <Bitcoin className="w-4 h-4 mr-1" />
                                                            Bitcoin (BTC)
                                                        </span>
                                                        <button
                                                            onClick={() => copyToClipboard(adminAddresses.bitcoin, 'btc')}
                                                            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                                        >
                                                            {copiedField === 'btc' ? (
                                                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                            ) : (
                                                                <Copy className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-300 text-sm break-all">{adminAddresses.bitcoin}</p>
                                                </div>

                                                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-purple-400 font-semibold">Ethereum (ETH)</span>
                                                        <button
                                                            onClick={() => copyToClipboard(adminAddresses.ethereum, 'eth')}
                                                            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                                        >
                                                            {copiedField === 'eth' ? (
                                                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                            ) : (
                                                                <Copy className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-300 text-sm break-all">{adminAddresses.ethereum}</p>
                                                </div>

                                                <div className="p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                                                    <div className="flex items-center justify-between mb-2">
                                                        <span className="text-green-400 font-semibold">USDT (TRC20)</span>
                                                        <button
                                                            onClick={() => copyToClipboard(adminAddresses.usdt, 'usdt')}
                                                            className="p-1 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                                        >
                                                            {copiedField === 'usdt' ? (
                                                                <CheckCircle2 className="w-4 h-4 text-green-400" />
                                                            ) : (
                                                                <Copy className="w-4 h-4" />
                                                            )}
                                                        </button>
                                                    </div>
                                                    <p className="text-gray-300 text-sm break-all">{adminAddresses.usdt}</p>
                                                </div>
                                            </div>

                                            <div className="mt-4 p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/30">
                                                <div className="flex items-center mb-2">
                                                    <AlertCircle className="w-5 h-5 text-yellow-400 mr-2" />
                                                    <span className="text-yellow-400 font-semibold">Payment Instructions</span>
                                                </div>
                                                <ul className="text-yellow-200 text-sm space-y-1">
                                                    <li>• Send exactly ${selectedPackage.amount} to any address above</li>
                                                    <li>• Upload payment screenshot below</li>
                                                    <li>• Wait for admin confirmation (24-48 hours)</li>
                                                    <li>• ROI starts after confirmation</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Upload Section */}
                                    <div className="space-y-6">
                                        <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-400/30">
                                            <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                                <Upload className="w-6 h-6 mr-2 text-green-400" />
                                                Payment Verification
                                            </h3>

                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-white font-semibold mb-2">Investment Package</label>
                                                    <div className="p-4 rounded-xl bg-white/10 border border-white/20">
                                                        <div className="flex items-center justify-between">
                                                            <span className="text-white font-medium">{selectedPackage.name}</span>
                                                            <span className="text-2xl font-bold text-green-400">${selectedPackage.amount}</span>
                                                        </div>
                                                        <div className="mt-2 text-sm text-gray-300">
                                                            Daily ROI: {selectedPackage.daily_roi} • Total: {selectedPackage.total_roi}
                                                        </div>
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-white font-semibold mb-2">Payment Screenshot</label>
                                                    <div
                                                        onClick={() => fileInputRef.current?.click()}
                                                        className="border-2 border-dashed border-white/20 rounded-xl p-8 text-center hover:border-white/40 transition-colors cursor-pointer group"
                                                    >
                                                        {uploadedFile ? (
                                                            <div className="space-y-2">
                                                                <FileImage className="w-12 h-12 text-green-400 mx-auto" />
                                                                <p className="text-green-400 font-medium">{uploadedFile.name}</p>
                                                                <p className="text-gray-400 text-sm">Click to change file</p>
                                                            </div>
                                                        ) : (
                                                            <div className="space-y-2">
                                                                <Camera className="w-12 h-12 text-gray-400 mx-auto group-hover:text-white transition-colors" />
                                                                <p className="text-gray-400 group-hover:text-white transition-colors">Click to upload payment screenshot</p>
                                                                <p className="text-gray-500 text-sm">PNG, JPG up to 10MB</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                    <input
                                                        ref={fileInputRef}
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={handleFileUpload}
                                                        className="hidden"
                                                    />
                                                </div>

                                                <button
                                                    onClick={handleInvestmentSubmit}
                                                    disabled={isSubmitting || !uploadedFile}
                                                    className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                                                >
                                                    {isSubmitting ? (
                                                        <div className="flex items-center justify-center">
                                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                            Submitting...
                                                        </div>
                                                    ) : (
                                                        'Submit Investment'
                                                    )}
                                                </button>

                                                <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                                    <div className="flex items-center mb-2">
                                                        <Clock className="w-4 h-4 text-blue-400 mr-2" />
                                                        <span className="text-blue-400 text-sm font-medium">Processing Time</span>
                                                    </div>
                                                    <p className="text-gray-300 text-sm">
                                                        Your investment will be activated within 24-48 hours after admin verification.
                                                        You&apos;ll receive an email confirmation once approved.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                );

            case 'network':
                return (
                    <div className="space-y-8">
                        <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                    My Network Tree
                                </h2>
                                <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20">
                                    <Users className="w-5 h-5 text-blue-400" />
                                    <span className="text-white font-medium">
                                        {loading ? "Loading..." : `${referrals.length} Members`}
                                    </span>
                                </div>
                            </div>

                            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
                                <div className="flex items-center justify-between mb-8">
                                    <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
                                        My Network Tree
                                    </h2>
                                    <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 border border-white/20">
                                        <Users className="w-5 h-5 text-blue-400" />
                                        <span className="text-white font-medium">{stats.total} Members</span>
                                    </div>
                                </div>

                                <div className="text-center py-16">
                                    <div className="relative inline-block">
                                        <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-2xl">
                                            <span className="text-white font-bold text-2xl">{user.name.charAt(0)}</span>
                                        </div>
                                        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full opacity-20 blur-xl" />
                                    </div>
                                    <h3 className="text-xl font-bold text-white mb-2">{user.name}</h3>
                                    <p className="text-gray-400 mb-2">Level 1 • {user.referral_code}</p>
                                    <div className="inline-flex items-center px-4 py-2 rounded-full bg-green-500/20 border border-green-400/30 text-green-400 text-sm font-medium">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                                        Network Leader
                                    </div>

                                    {/* Referrals List */}
                                    <div className="mt-8 p-6 rounded-2xl bg-white/5 border border-white/10 max-w-md mx-auto">
                                        {loading ? (
                                            <p className="text-gray-300">Fetching referrals...</p>
                                        ) : referrals.length === 0 ? (
                                            <>
                                                <p className="text-gray-300 mb-4">No direct referrals yet</p>
                                                <button
                                                    onClick={() => alert("Redirect to referrals page")}
                                                    className="w-full px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform cursor-pointer"
                                                >
                                                    Start Building Your Network
                                                </button>
                                            </>
                                        ) : (
                                            <ul className="space-y-3 text-left">
                                                {referrals.map((ref) => (
                                                    <li
                                                        key={ref.id}
                                                        className="p-3 rounded-xl bg-white/10 border border-white/20 flex justify-between items-center"
                                                    >
                                                        <span className="text-gray-200 font-medium">{ref.name}</span>
                                                        <span className="text-sm text-gray-400">{ref.email}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        )}
                                    </div>
                                </div>
                            </div>

                        </div>

                    </div>
                );

            case 'referrals':
                return (
                    <div className="space-y-8">
                        <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8">
                                Referral Management
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-400/30">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                            <Target className="w-6 h-6 mr-2 text-blue-400" />
                                            Your Referral Code
                                        </h3>
                                        <div className="bg-white/10 rounded-xl p-4 mb-4 backdrop-blur-sm">
                                            <p className="text-3xl font-mono font-bold text-center text-blue-400 tracking-wider">
                                                {user.referral_code}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(user.referral_code, 'referral')}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                                        >
                                            {copiedField === 'referral' ? (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                                    Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-5 h-5 mr-2" />
                                                    Copy Code
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-gradient-to-br from-green-500/20 to-emerald-600/20 border border-green-400/30">
                                        <h3 className="text-xl font-bold text-white mb-4 flex items-center">
                                            <Award className="w-6 h-6 mr-2 text-green-400" />
                                            Referral Link
                                        </h3>
                                        <div className="bg-white/10 rounded-xl p-3 mb-4 backdrop-blur-sm">
                                            <p className="text-sm text-gray-300 break-all">
                                                https://mlm-network.com/register?ref={user.referral_code}
                                            </p>
                                        </div>
                                        <button
                                            onClick={() => copyToClipboard(`https://mlm-network.com/register?ref=${user.referral_code}`, 'link')}
                                            className="w-full flex items-center justify-center px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-xl transition-all duration-300 hover:scale-105 cursor-pointer"
                                        >
                                            {copiedField === 'link' ? (
                                                <>
                                                    <CheckCircle2 className="w-5 h-5 mr-2" />
                                                    Link Copied!
                                                </>
                                            ) : (
                                                <>
                                                    <Copy className="w-5 h-5 mr-2" />
                                                    Copy Link
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-600/20 border border-purple-400/30 mt-6">
                                    <h3 className="text-xl font-bold text-white mb-6 flex items-center">
                                        <BarChart3 className="w-6 h-6 mr-2 text-purple-400" />
                                        Referral Statistics
                                    </h3>
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                                            <span className="text-gray-300">Total Referrals:</span>
                                            <span className="text-2xl font-bold text-white">{stats.total}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                                            <span className="text-gray-300">Active Members:</span>
                                            <span className="text-2xl font-bold text-white">{stats.active}</span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                                            <span className="text-gray-300">Commission Earned:</span>
                                            <span className="text-2xl font-bold text-green-400">
                                                ${user.wallets.level_income}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center p-4 rounded-xl bg-white/10 backdrop-blur-sm">
                                            <span className="text-gray-300">This Month:</span>
                                            <span className="text-2xl font-bold text-purple-400">${stats.thisMonth}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'transactions':
                return (
                    <div className="space-y-8">
                        <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8">
                                Transaction History
                            </h2>

                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-400/20 hover:border-green-400/40 transition-all duration-300">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-xl bg-green-500/20">
                                            <DollarSign className="w-6 h-6 text-green-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-white">Initial Investment</p>
                                            <p className="text-gray-400 text-sm">{formatDate(user.createdAt)}</p>
                                            <div className="flex items-center mt-1">
                                                <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                                                <span className="text-green-400 text-xs font-medium">Completed</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-green-400">+${user.investment}</p>
                                        <p className="text-xs text-gray-400">Investment</p>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between p-6 rounded-2xl bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-400/20 hover:border-blue-400/40 transition-all duration-300">
                                    <div className="flex items-center space-x-4">
                                        <div className="p-3 rounded-xl bg-blue-500/20">
                                            <TrendingUp className="w-6 h-6 text-blue-400" />
                                        </div>
                                        <div>
                                            <p className="text-lg font-semibold text-white">ROI Generated</p>
                                            <p className="text-gray-400 text-sm">Accumulated returns</p>
                                            <div className="flex items-center mt-1">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2 animate-pulse" />
                                                <span className="text-blue-400 text-xs font-medium">Active</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-blue-400">+${user.wallets.roi}</p>
                                        <p className="text-xs text-gray-400">ROI</p>
                                    </div>
                                </div>

                                <div className="space-y-4 mt-6">
                                    <h3 className="text-xl font-bold text-white">Withdrawal History</h3>
                                    {withdrawals.length === 0 ? (
                                        <p className="text-gray-400 text-sm">No withdrawals yet</p>
                                    ) : (
                                        withdrawals.map((w) => (
                                            <div
                                                key={w._id}
                                                className="flex items-center justify-between p-4 rounded-2xl bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-400/20"
                                            >
                                                <div>
                                                    <p className="text-white font-semibold">${w.amount}</p>
                                                    <p className="text-gray-400 text-xs">{new Date(w.createdAt).toLocaleDateString()}</p>
                                                </div>
                                                <span
                                                    className={`px-3 py-1 text-xs rounded-full font-medium ${w.status === "pending"
                                                        ? "bg-yellow-500/20 text-yellow-400"
                                                        : w.status === "approved"
                                                            ? "bg-green-500/20 text-green-400"
                                                            : "bg-red-500/20 text-red-400"
                                                        }`}
                                                >
                                                    {w.status}
                                                </span>
                                            </div>
                                        ))
                                    )}
                                </div>


                            </div>
                        </div>
                    </div>
                );

            case 'wallet':
                return (
                    <div className="space-y-8">
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
                                <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                                    <Wallet className="w-7 h-7 mr-3 text-purple-400" />
                                    Wallet Overview
                                </h3>

                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/20 to-cyan-600/20 border border-blue-400/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-blue-400 font-medium">ROI Wallet</p>
                                            <TrendingUp className="w-5 h-5 text-blue-400" />
                                        </div>
                                        <p className="text-3xl font-bold text-white">${user.wallets.roi}</p>
                                        <p className="text-blue-200 text-sm mt-1">Return on Investment</p>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-gradient-to-r from-purple-500/20 to-pink-600/20 border border-purple-400/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-purple-400 font-medium">Level Income</p>
                                            <Users className="w-5 h-5 text-purple-400" />
                                        </div>
                                        <p className="text-3xl font-bold text-white">${user.wallets.level_income}</p>
                                        <p className="text-purple-200 text-sm mt-1">Referral Commissions</p>
                                    </div>

                                    <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-400/30">
                                        <div className="flex items-center justify-between mb-2">
                                            <p className="text-green-400 font-medium">Total Available</p>
                                            <DollarSign className="w-5 h-5 text-green-400" />
                                        </div>
                                        <p className="text-3xl font-bold text-white">${user.wallets.total_Income}</p>
                                        <p className="text-green-200 text-sm mt-1">Ready for withdrawal</p>
                                    </div>
                                </div>
                            </div>

                            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
                                <h3 className="text-2xl font-bold text-white mb-8 flex items-center">
                                    <Shield className="w-7 h-7 mr-3 text-green-400" />
                                    Withdrawal Center
                                </h3>

                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-yellow-500/10 border border-yellow-400/30">
                                        <div className="flex items-center mb-4">
                                            <Zap className="w-6 h-6 text-yellow-400 mr-3" />
                                            <p className="text-yellow-400 font-semibold">Withdrawal Limits</p>
                                        </div>
                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Minimum:</span>
                                                <span className="text-white font-medium">$50.00</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Processing Time:</span>
                                                <span className="text-white font-medium">24-48 hours</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-gray-300">Daily Limit:</span>
                                                <span className="text-white font-medium">$5,000</span>
                                            </div>
                                        </div>
                                    </div>

                                    <button
                                        onClick={() => setShowWithdrawalModal(true)}
                                        className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold text-lg rounded-2xl hover:scale-105 transition-all duration-300 shadow-2xl hover:shadow-green-500/25 cursor-pointer">
                                        Request Withdrawal
                                    </button>

                                    <div className="p-4 rounded-xl bg-white/5 border border-white/10">
                                        <p className="text-sm text-gray-400 text-center leading-relaxed">
                                            Withdrawals are processed securely through our automated system.
                                            You&apos;ll receive a confirmation email once your request is approved.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            case 'settings':
                return (
                    <div className="space-y-8">
                        <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
                            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent mb-8">
                                Account Settings
                            </h2>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-white font-semibold mb-3">Full Name</label>
                                        <input
                                            type="text"
                                            value={user.name}
                                            readOnly
                                            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/25 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white font-semibold mb-3">Email Address</label>
                                        <input
                                            type="email"
                                            value={user.email}
                                            readOnly
                                            className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm focus:border-purple-400 focus:ring-2 focus:ring-purple-400/25 transition-all"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white font-semibold mb-3">Referral Code</label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={user.referral_code}
                                                readOnly
                                                className="w-full p-4 pr-12 rounded-xl bg-white/10 border border-white/20 text-white backdrop-blur-sm font-mono"
                                            />
                                            <button
                                                onClick={() => copyToClipboard(user.referral_code, 'settings')}
                                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                                            >
                                                {copiedField === 'settings' ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                ) : (
                                                    <Copy className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-600/20 border border-blue-400/30">
                                        <h3 className="text-lg font-bold text-white mb-4">Account Status</h3>
                                        <div className="space-y-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Verification:</span>
                                                <div className="flex items-center">
                                                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2" />
                                                    <span className="text-green-400 font-medium">Verified</span>
                                                </div>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Member Since:</span>
                                                <span className="text-white font-medium">{formatDate(user.createdAt)}</span>
                                            </div>
                                            <div className="flex justify-between items-center">
                                                <span className="text-gray-300">Account Type:</span>
                                                <span className="inline-flex px-3 py-1 rounded-full text-xs font-medium bg-blue-500/20 text-blue-400 border border-blue-400/30">
                                                    {user.type.toUpperCase()}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex flex-col space-y-3">
                                        <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform shadow-lg cursor-pointer">
                                            Update Profile
                                        </button>
                                        <button className="px-6 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors backdrop-blur-sm cursor-pointer">
                                            Change Password
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                );

            default:
                return (
                    <div className="space-y-8">
                        {/* Welcome Section */}
                        <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
                            <div className="flex flex-col lg:flex-row lg:items-center justify-between">
                                <div className="mb-6 lg:mb-0">
                                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-blue-600 bg-clip-text text-transparent mb-3">
                                        Welcome Back {user.name}!
                                    </h1>
                                    <p className="text-gray-300 text-lg">
                                        Member since {formatDate(user.createdAt)} • ID: {user.referral_code}
                                    </p>
                                    <div className="flex items-center mt-2">
                                        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse" />
                                        <span className="text-green-400 text-sm font-medium">Account Active</span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <button
                                        onClick={() => setShowWithdrawalModal(true)}
                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-purple-600 text-white font-semibold shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 cursor-pointer">
                                        <Wallet className="w-5 h-5 inline mr-2" />
                                        Withdraw Funds
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('referrals')}
                                        className="px-6 py-3 rounded-xl backdrop-blur-sm bg-white/10 border border-white/20 text-white font-semibold hover:bg-white/20 transition-all duration-300 cursor-pointer"
                                    >
                                        <UserPlus className="w-5 h-5 inline mr-2" />
                                        Invite Friends
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
                            <StatCard
                                title="Total Investment"
                                value={`${user.investment}`}
                                subtitle="Initial capital invested"
                                gradient="from-green-500 to-emerald-600"
                                icon={DollarSign}
                                trend="12.5"
                            />
                            <StatCard
                                title="ROI Earnings"
                                value={`${user.wallets.roi}`}
                                subtitle="Return on investment"
                                gradient="from-blue-500 to-cyan-600"
                                icon={TrendingUp}
                                trend="8.3"
                            />
                            <StatCard
                                title="Level Income"
                                value={`${user.wallets.level_income}`}
                                subtitle="Referral commissions"
                                gradient="from-purple-500 to-pink-600"
                                icon={Users}
                            />
                            <StatCard
                                title="Total Available"
                                value={`${user.wallets.total_Income}`}
                                subtitle="Ready to withdraw"
                                gradient="from-orange-500 to-red-600"
                                icon={Wallet}
                                trend="15.7"
                            />
                        </div>

                        {/* Quick Actions & Referral Info */}
                        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
                            {/* Quick Actions */}
                            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <Zap className="w-6 h-6 mr-3 text-yellow-400" />
                                    Quick Actions
                                </h2>
                                <div className="space-y-4">
                                    {[
                                        { title: 'Refer New Members', desc: 'Earn commissions instantly', icon: UserPlus, color: 'from-green-500 to-emerald-600', action: () => setActiveTab('referrals') },
                                        { title: 'View Network Tree', desc: 'Monitor team growth', icon: Users, color: 'from-blue-500 to-cyan-600', action: () => setActiveTab('network') },
                                        { title: 'Transaction History', desc: 'Track all earnings', icon: CreditCard, color: 'from-purple-500 to-pink-600', action: () => setActiveTab('transactions') },
                                        { title: 'Withdraw Earnings', desc: 'Access your funds', icon: Wallet, color: 'from-orange-500 to-red-600', action: () => setShowWithdrawalModal(true) }
                                    ].map((action, index) => (
                                        <button
                                            key={index}
                                            onClick={action.action}
                                            className="w-full group relative overflow-hidden cursor-pointer"
                                        >
                                            <div className="absolute inset-0 bg-gradient-to-r from-white/5 to-white/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-300" />
                                            <div className="relative flex items-center p-4 rounded-2xl bg-white/5 border border-white/10 hover:border-white/20 transition-all duration-300">
                                                <div className={`p-3 rounded-xl bg-gradient-to-r ${action.color} mr-4 group-hover:scale-110 transition-transform`}>
                                                    <action.icon className="w-5 h-5 text-white" />
                                                </div>
                                                <div className="text-left">
                                                    <h3 className="text-white font-semibold">{action.title}</h3>
                                                    <p className="text-gray-400 text-sm">{action.desc}</p>
                                                </div>
                                                <ArrowUpRight className="w-5 h-5 text-gray-400 ml-auto group-hover:text-white group-hover:translate-x-1 transition-all" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Referral Information */}
                            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-8 border border-white/10">
                                <h2 className="text-2xl font-bold text-white mb-6 flex items-center">
                                    <Target className="w-6 h-6 mr-3 text-purple-400" />
                                    Referral Center
                                </h2>
                                <div className="space-y-6">
                                    <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30">
                                        <div className="flex items-center justify-between mb-4">
                                            <div>
                                                <p className="text-gray-300 text-sm">Your Referral Code</p>
                                                <p className="text-2xl font-mono font-bold text-white">{user.referral_code}</p>
                                            </div>
                                            <button
                                                onClick={() => copyToClipboard(user.referral_code, 'dashboard')}
                                                className="p-3 rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all duration-300 hover:scale-110 cursor-pointer"
                                            >
                                                {copiedField === 'dashboard' ? (
                                                    <CheckCircle2 className="w-5 h-5 text-green-400" />
                                                ) : (
                                                    <Copy className="w-5 h-5" />
                                                )}
                                            </button>
                                        </div>
                                        <div className="text-center">
                                            <p className="text-blue-200 text-sm">Share this code to earn commissions</p>
                                        </div>
                                    </div>

                                    {user.referred_by && (
                                        <div className="p-6 rounded-2xl bg-gradient-to-r from-green-500/20 to-emerald-600/20 border border-green-400/30">
                                            <div className="flex items-center mb-2">
                                                <Shield className="w-5 h-5 text-green-400 mr-2" />
                                                <p className="text-green-400 font-medium">Referred by</p>
                                            </div>
                                            <p className="text-xl font-bold text-white">{user.referred_by}</p>
                                            <p className="text-green-200 text-sm mt-1">Your sponsor in the network</p>
                                        </div>
                                    )}

                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                            <p className="text-2xl font-bold text-blue-400">0</p>
                                            <p className="text-gray-400 text-sm">Direct Refs</p>
                                        </div>
                                        <div className="text-center p-4 rounded-xl bg-white/5 border border-white/10">
                                            <p className="text-2xl font-bold text-purple-400">${user.wallets.level_income}</p>
                                            <p className="text-gray-400 text-sm">Earned</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Recent Activity & Performance */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
                            {/* Recent Activity */}
                            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center">
                                    <BarChart3 className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-blue-400" />
                                    Recent Activity
                                </h2>

                                <div className="space-y-3 md:space-y-4">
                                    {[
                                        { type: 'investment', amount: user.investment, desc: 'Initial Investment', date: user.createdAt, color: 'green' },
                                        { type: 'roi', amount: user.wallets.roi, desc: 'ROI Generated', date: new Date().toISOString(), color: 'blue' },
                                        { type: 'verification', amount: 0, desc: 'Account Verified', date: user.createdAt, color: 'purple' }
                                    ].map((activity, index) => (
                                        <div
                                            key={index}
                                            className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 rounded-xl bg-gradient-to-r from-${activity.color}-500/10 to-${activity.color}-600/10 border border-${activity.color}-400/20 hover:border-${activity.color}-400/40 transition-all duration-300`}
                                        >
                                            <div className="flex items-center space-x-3 md:space-x-4 mb-2 sm:mb-0">
                                                <div className={`p-2 md:p-3 rounded-xl bg-${activity.color}-500/20`}>
                                                    {activity.type === 'investment' && <DollarSign className={`w-4 h-4 md:w-5 md:h-5 text-${activity.color}-400`} />}
                                                    {activity.type === 'roi' && <TrendingUp className={`w-4 h-4 md:w-5 md:h-5 text-${activity.color}-400`} />}
                                                    {activity.type === 'verification' && <Shield className={`w-4 h-4 md:w-5 md:h-5 text-${activity.color}-400`} />}
                                                </div>
                                                <div>
                                                    <p className="text-white text-sm md:text-base font-medium">{activity.desc}</p>
                                                    <p className="text-gray-400 text-xs md:text-sm">{formatDate(activity.date)}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                {activity.amount > 0 && (
                                                    <p className={`text-${activity.color}-400 font-bold text-sm md:text-base`}>+${activity.amount}</p>
                                                )}
                                                <div className={`flex items-center justify-end text-${activity.color}-400 text-xs font-medium`}>
                                                    <div className={`w-2 h-2 bg-${activity.color}-400 rounded-full mr-1 ${activity.type === 'roi' ? 'animate-pulse' : ''}`} />
                                                    {activity.type === 'verification' ? 'Verified' : 'Complete'}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Performance Overview */}
                            <div className="backdrop-blur-2xl bg-white/5 rounded-3xl p-6 md:p-8 border border-white/10">
                                <h2 className="text-xl md:text-2xl font-bold text-white mb-4 md:mb-6 flex items-center">
                                    <Award className="w-5 h-5 md:w-6 md:h-6 mr-2 md:mr-3 text-orange-400" />
                                    Performance Overview
                                </h2>

                                <div className="space-y-6">
                                    {/* ROI Progress */}
                                    <div className="space-y-3 md:space-y-4">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center">
                                                <div className="w-2 h-2 md:w-3 md:h-3 bg-blue-400 rounded-full mr-2 md:mr-3" />
                                                <span className="text-gray-300 text-sm md:text-base">ROI Progress</span>
                                            </div>
                                            <span className="text-white font-semibold text-sm md:text-base">${user.wallets.roi}</span>
                                        </div>
                                        <div className="w-full bg-gray-700/30 rounded-full h-2 md:h-3">
                                            <div
                                                className="bg-gradient-to-r from-blue-500 to-cyan-600 h-2 md:h-3 rounded-full transition-all duration-1000"
                                                style={{ width: `${Math.min((user.wallets.roi / user.investment) * 100, 100)}%` }}
                                            />
                                        </div>
                                        <p className="text-blue-200 text-xs md:text-sm">
                                            {((user.wallets.roi / user.investment) * 100).toFixed(1)}% return on initial investment
                                        </p>
                                    </div>

                                    {/* Stats */}
                                    <div className="grid grid-cols-2 gap-3 md:gap-4">
                                        <div className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-green-500/10 to-emerald-600/10 border border-green-400/20">
                                            <p className="text-lg md:text-2xl font-bold text-green-400">1</p>
                                            <p className="text-gray-300 text-xs md:text-sm">Current Level</p>
                                        </div>
                                        <div className="text-center p-3 md:p-4 rounded-xl bg-gradient-to-br from-purple-500/10 to-pink-600/10 border border-purple-400/20">
                                            <p className="text-lg md:text-2xl font-bold text-purple-400">0</p>
                                            <p className="text-gray-300 text-xs md:text-sm">Team Size</p>
                                        </div>
                                    </div>

                                    {/* Total Earnings */}
                                    <div className="p-3 md:p-4 rounded-xl bg-gradient-to-r from-orange-500/10 to-red-600/10 border border-orange-400/20">
                                        <div className="flex items-center justify-between mb-1 md:mb-2">
                                            <p className="text-orange-400 font-medium text-sm md:text-base">Total Earnings</p>
                                            <p className="text-lg md:text-2xl font-bold text-white">${user.wallets.total_Income}</p>
                                        </div>
                                        <p className="text-orange-200 text-xs md:text-sm">
                                            Growth: {user.wallets.total_Income > user.investment ? '+' : ''}
                                            {((user.wallets.total_Income / user.investment) * 100 - 100).toFixed(1)}% since joining
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                );
        }
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
            {/* 3D Background */}
            <div ref={mountRef} className="fixed inset-0 z-0" />

            {/* Gradient Overlay */}
            <div className="fixed inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-slate-900/20 z-10" />

            {/* Withdrawal Modal */}
            {showWithdrawalModal && (
                <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="backdrop-blur-2xl bg-white/10 rounded-3xl p-8 border border-white/20 max-w-md w-full">
                        {/* Header */}
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-bold text-white flex items-center">
                                <Wallet className="w-6 h-6 mr-2 text-green-400" />
                                Withdraw Funds
                            </h3>
                            <button
                                onClick={() => setShowWithdrawalModal(false)}
                                className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Body */}
                        <div className="space-y-4">
                            {/* Balance */}
                            <div className="p-4 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-600/10 border border-green-400/20">
                                <div className="flex items-center justify-between">
                                    <span className="text-green-400 font-medium">Available Balance:</span>
                                    <span className="text-2xl font-bold text-white">${user.wallets.total_Income}</span>
                                </div>
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-white font-semibold mb-2">Withdrawal Amount</label>
                                <input
                                    type="number"
                                    value={withdrawalAmount}
                                    onChange={(e) => setWithdrawalAmount(e.target.value)}
                                    placeholder="Enter amount (min $50)"
                                    className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/25 transition-all"
                                />
                            </div>

                            {/* Address */}
                            <div>
                                <label className="block text-white font-semibold mb-2">Crypto Address</label>
                                <input
                                    type="text"
                                    value={cryptoAddress}
                                    onChange={(e) => setCryptoAddress(e.target.value)}
                                    placeholder="Enter your wallet address"
                                    className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:border-green-400 focus:ring-2 focus:ring-green-400/25 transition-all"
                                />
                            </div>

                            {/* Method */}
                            <div>
                                <label className="block text-white font-semibold mb-2">Withdrawal Method</label>
                                <select
                                    value={method}
                                    onChange={(e) => setMethod(e.target.value)}
                                    className="w-full p-4 rounded-xl bg-white/10 border border-white/20 text-white focus:border-green-400 focus:ring-2 focus:ring-green-400/25 transition-all"
                                >
                                    <option value="USDT">USDT (TRC20)</option>
                                    <option value="BTC">Bitcoin (BTC)</option>
                                    <option value="ETH">Ethereum (ETH)</option>
                                </select>
                            </div>

                            {/* Info */}
                            <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-400/30">
                                <div className="flex items-center mb-2">
                                    <AlertCircle className="w-4 h-4 text-yellow-400 mr-2" />
                                    <span className="text-yellow-400 text-sm font-medium">Withdrawal Info</span>
                                </div>
                                <ul className="text-yellow-200 text-xs space-y-1">
                                    <li>• Minimum withdrawal: $50</li>
                                    <li>• Processing time: 24-48 hours</li>
                                    <li>• No withdrawal fees</li>
                                </ul>
                            </div>

                            {/* Actions */}
                            <div className="flex gap-3">
                                <button
                                    onClick={() => setShowWithdrawalModal(false)}
                                    className="flex-1 px-4 py-3 border border-white/20 text-white font-semibold rounded-xl hover:bg-white/10 transition-colors cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleWithdrawal}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-xl hover:scale-105 transition-transform cursor-pointer"
                                >
                                    Withdraw
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

            )}

            {/* Fixed Aside Navigation */}
            <aside
                className={`fixed left-0 top-0 z-50 h-full w-80 transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } lg:translate-x-0 overflow-y-auto custom-scrollbar`}
            >
                <div className="h-full backdrop-blur-3xl bg-white/5 border-r border-white/10">
                    {/* Logo/Brand Section */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                    <Zap className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                                        MLM Network
                                    </h1>
                                    <p className="text-xs text-gray-400">Professional Dashboard</p>
                                </div>
                            </div>
                            <button
                                onClick={() => setIsSidebarOpen(false)}
                                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* User Profile Section */}
                    <div className="p-6 border-b border-white/10">
                        <div className="flex items-center space-x-4 mb-4">
                            <div className="relative">
                                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                    {user.name.charAt(0)}
                                </div>
                                <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-slate-900" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-white font-semibold truncate">{user.name}</p>
                                <p className="text-gray-400 text-sm">ID: {user.referral_code}</p>
                            </div>
                        </div>

                        <div className="bg-gradient-to-r from-green-500/10 to-emerald-600/10 rounded-xl p-4 border border-green-400/20">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-green-400 text-sm font-medium">Total Balance</p>
                                    <p className="text-xl font-bold text-white">${user.wallets.total_Income}</p>
                                </div>
                                <div className="p-2 bg-green-500/20 rounded-lg">
                                    <Wallet className="w-5 h-5 text-green-400" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Navigation Menu */}
                    <nav className="flex-1 bg-[#1a1b29] overflow-y-auto p-6">
                        <div className="space-y-2">
                            {navItems.map((item) => {
                                const Icon = item.icon;
                                const isActive = activeTab === item.id;

                                return (
                                    <button
                                        key={item.id}
                                        onClick={() => {
                                            setActiveTab(item.id);
                                            setIsSidebarOpen(false);
                                        }}
                                        className={`w-full group relative overflow-hidden cursor-pointer ${isActive
                                            ? 'bg-gradient-to-r from-blue-500/20 to-purple-600/20 border border-blue-400/30 text-white shadow-2xl shadow-blue-500/10'
                                            : 'text-gray-300 hover:text-white hover:bg-white/5 border border-transparent'
                                            } flex items-center px-4 py-3 rounded-xl transition-all duration-300`}
                                    >
                                        <div className={`p-2 rounded-lg mr-3 transition-all duration-300 ${isActive
                                            ? `bg-gradient-to-r ${item.color}`
                                            : 'bg-white/5 group-hover:bg-white/10'
                                            }`}>
                                            <Icon className="w-5 h-5" />
                                        </div>
                                        <span className="font-medium">{item.label}</span>

                                        {isActive && (
                                            <div className="ml-auto">
                                                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
                                            </div>
                                        )}

                                        {/* Hover effect */}
                                        <div className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300 rounded-xl`} />
                                    </button>
                                );
                            })}
                        </div>

                        {/* Quick Stats in Sidebar */}
                        <div className="mt-8 space-y-4">
                            <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-cyan-600/10 border border-blue-400/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-blue-400 text-sm font-medium">ROI</span>
                                    <TrendingUp className="w-4 h-4 text-blue-400" />
                                </div>
                                <p className="text-lg font-bold text-white">${user.wallets.roi}</p>
                            </div>

                            <div className="p-4 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-600/10 border border-purple-400/20">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-purple-400 text-sm font-medium">Network</span>
                                    <Users className="w-4 h-4 text-purple-400" />
                                </div>
                                <p className="text-lg font-bold text-white">0 Members</p>
                            </div>
                        </div>
                    </nav>

                    {/* Footer */}
                    <div className="p-6 border-t border-white/10 bg-[#1a1b29]">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center px-4 py-3 bg-gradient-to-r from-red-500/20 to-red-600/20 border border-red-400/30 text-red-400 rounded-xl hover:bg-red-500/30 transition-all duration-300 cursor-pointer">
                            <LogOut className="w-5 h-5 mr-2" />
                            Logout
                        </button>
                    </div>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {
                isSidebarOpen && (
                    <div
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                        onClick={() => setIsSidebarOpen(false)}
                    />
                )
            }

            {/* Main Content */}
            <main className="lg:ml-80 relative z-20">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-30 backdrop-blur-3xl bg-white/5 border-b border-white/10">
                    <div className="flex items-center justify-between px-6 py-4">
                        <div className="flex items-center space-x-4">
                            <button
                                onClick={() => setIsSidebarOpen(true)}
                                className="lg:hidden p-2 text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <Menu className="w-6 h-6" />
                            </button>

                            <div className="hidden md:flex items-center space-x-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <input
                                        type="text"
                                        placeholder="Search dashboard..."
                                        className="pl-10 pr-4 py-2 w-64 bg-white/10 border border-white/20 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/25 transition-all"
                                    />
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center space-x-4">
                            <div className="hidden md:flex items-center space-x-2 px-3 py-2 rounded-xl bg-white/10 border border-white/20">
                                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                                <span className="text-sm text-gray-300">Online</span>
                            </div>

                            <button className="relative p-3 text-gray-400 hover:text-white transition-colors cursor-pointer">
                                <Bell className="w-5 h-5" />
                                <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                    {notifications.filter(n => !n.read).length}
                                </div>
                            </button>
                            <button
                                onClick={handleLogout}
                                className="p-3 text-gray-400 hover:text-white transition-colors cursor-pointer">
                                <LogOut className="w-5 h-5" />
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <div className="p-6 lg:p-8">
                    {renderContent()}
                </div>
            </main>
        </div >
    );
};

export default ModernMLMDashboard;
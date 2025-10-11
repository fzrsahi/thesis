"use client";

import { motion } from "framer-motion";
import { 
  User, 
  Mail, 
  Lock, 
  Save, 
  Eye, 
  EyeOff, 
  Calendar,
  Shield
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toast } from "sonner";

import { type ProfileUpdatePayload } from "@/app/shared/validations/schema/profileSchema";
import Button from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Input from "@/components/ui/input";
import Label from "@/components/ui/label";
import { TypographyH2, TypographyP } from "@/components/ui/typography";

const staggerContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5 } },
};

interface ProfileData {
  id: number;
  email: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

const ProfilePage = () => {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // Password visibility states
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  // Form errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    fetchProfileData();
  }, []);

  const fetchProfileData = async () => {
    try {
      const response = await fetch("/api/profile");
      const result = await response.json();
      
      if (result.success) {
        setProfileData(result.data);
        setName(result.data.name);
        setEmail(result.data.email);
      } else {
        toast.error(result.error || 'Gagal memuat profil');
      }
    } catch (error) {
      toast.error('Gagal memuat profil');
    } finally {
      setLoading(false);
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    // Validate name
    if (!name.trim()) {
      newErrors.name = "Nama wajib diisi";
    } else if (name.trim().length < 2) {
      newErrors.name = "Nama minimal 2 karakter";
    }
    
    // Validate email
    if (!email.trim()) {
      newErrors.email = "Email wajib diisi";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = "Format email tidak valid";
    }
    
    // Validate password fields if any password field is filled
    if (currentPassword || newPassword || confirmPassword) {
      if (!currentPassword) {
        newErrors.currentPassword = "Password saat ini wajib diisi";
      }
      
      if (!newPassword) {
        newErrors.newPassword = "Password baru wajib diisi";
      } else if (newPassword.length < 8) {
        newErrors.newPassword = "Password minimal 8 karakter";
      } else if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(newPassword)) {
        newErrors.newPassword = "Password harus mengandung huruf besar, huruf kecil, dan angka";
      }
      
      if (!confirmPassword) {
        newErrors.confirmPassword = "Konfirmasi password wajib diisi";
      } else if (newPassword !== confirmPassword) {
        newErrors.confirmPassword = "Password tidak cocok";
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      toast.error("Mohon perbaiki kesalahan pada form");
      return;
    }

    setSaving(true);

    try {
      const updateData: ProfileUpdatePayload = {
        name: name.trim(),
        email: email.trim(),
      };

      // Only include password fields if they're being changed
      if (currentPassword && newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (result.success) {
        toast.success("Profile updated successfully");
        setProfileData(result.data);
        
        // Clear password fields
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(result.error || 'Gagal memperbarui profil');
      }
    } catch (error) {
      toast.error('Gagal memperbarui profil');
    } finally {
      setSaving(false);
    }
  };

  const formatDate = (dateString: string) => new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

  if (loading) {
    return (
      <div className="w-full flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-6">
        <TypographyH2 className="flex items-center gap-2 text-zinc-900">
          <User className="h-10 w-10 font-extrabold" />
          Pengaturan Profil
        </TypographyH2>
        <TypographyP className="border-b border-gray-300 pb-4 text-zinc-900">
          Kelola informasi profil dan keamanan akun Anda
        </TypographyP>
        <div className="mb-6 border-t border-gray-500" />
      </div>

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {/* Profile Information Card */}
        <motion.div variants={staggerItem}>
          <Card className="border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <User className="h-5 w-5" />
                Informasi Profil
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Update informasi dasar profil Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-zinc-300">Nama Lengkap</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      id="name"
                      type="text"
                      value={name}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                      className="pl-10 bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400 focus:border-blue-500"
                      placeholder="Masukkan nama lengkap"
                    />
                  </div>
                  {errors.name && (
                    <p className="text-red-400 text-sm">
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-zinc-300">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                      className="pl-10 bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400 focus:border-blue-500"
                      placeholder="Masukkan email"
                    />
                  </div>
                  {errors.email && (
                    <p className="text-red-400 text-sm">
                      {errors.email}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Password Change Card */}
        <motion.div variants={staggerItem}>
          <Card className="border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-xl backdrop-blur-sm">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-white">
                <Shield className="h-5 w-5" />
                Ubah Password
              </CardTitle>
              <CardDescription className="text-zinc-300">
                Kosongkan jika tidak ingin mengubah password
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword" className="text-zinc-300">Password Saat Ini</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? "text" : "password"}
                    value={currentPassword}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCurrentPassword(e.target.value)}
                    className="pl-10 pr-10 bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400 focus:border-blue-500"
                    placeholder="Masukkan password saat ini"
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                  >
                    {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {errors.currentPassword && (
                  <p className="text-red-400 text-sm">
                    {errors.currentPassword}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="newPassword" className="text-zinc-300">Password Baru</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      value={newPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewPassword(e.target.value)}
                      className="pl-10 pr-10 bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400 focus:border-blue-500"
                      placeholder="Masukkan password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                    >
                      {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.newPassword && (
                    <p className="text-red-400 text-sm">
                      {errors.newPassword}
                    </p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-zinc-300">Konfirmasi Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-zinc-400" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      value={confirmPassword}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setConfirmPassword(e.target.value)}
                      className="pl-10 pr-10 bg-zinc-800 border-zinc-600 text-white placeholder-zinc-400 focus:border-blue-500"
                      placeholder="Konfirmasi password baru"
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-zinc-400 hover:text-zinc-300"
                    >
                      {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-400 text-sm">
                      {errors.confirmPassword}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Account Information Card */}
        {profileData && (
          <motion.div variants={staggerItem}>
            <Card className="border border-zinc-600/50 bg-gradient-to-br from-zinc-900 via-zinc-800 to-zinc-900 shadow-xl backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-white">
                  <Calendar className="h-5 w-5" />
                  Informasi Akun
                </CardTitle>
                <CardDescription className="text-zinc-300">
                  Detail informasi akun Anda
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-zinc-400 mb-1">ID Pengguna</p>
                    <p className="text-white font-mono">{profileData.id}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 mb-1">Role</p>
                    <p className="text-white capitalize">{session?.user?.role}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 mb-1">Akun Dibuat</p>
                    <p className="text-white">{formatDate(profileData.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-zinc-400 mb-1">Terakhir Diupdate</p>
                    <p className="text-white">{formatDate(profileData.updatedAt)}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Save Button */}
        <motion.div variants={staggerItem} className="flex justify-end">
          <Button
            onClick={handleSaveProfile}
            disabled={saving}
            className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-8 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <div className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white" />
                Menyimpan...
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Simpan Perubahan
              </div>
            )}
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default ProfilePage;

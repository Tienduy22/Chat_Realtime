import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { updateAvatar, updateProfile, profile, changePassword } from "../../services/user.service";

const ProfilePage = () => {
  const userFromRedux = useSelector((state) => state.user || {});

  const [user, setUser] = useState({
    user_id: "",
    username: "",
    full_name: "Đang tải...",
    email: "",
    phone: "",
    avatarUrl: "",
  });

  const [nameInput, setNameInput] = useState("");
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  // ─── State cho modal đổi mật khẩu ───
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const fileInputRef = useRef(null);
  const nameInputRef = useRef(null);

  // Fetch profile (giữ nguyên)
  useEffect(() => {
    const fetchProfile = async () => {
      const user_id = userFromRedux.user_id;
      if (!user_id) {
        setErrorMsg("Không tìm thấy thông tin người dùng.");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const result = await profile(user_id);
        const userData = result.data || result;

        setUser({
          user_id: userData.user_id || user_id,
          username: userData.username || "",
          full_name: userData.full_name || "Unknown User",
          email: userData.email || "",
          phone: userData.phone || "",
          avatarUrl: userData.avatar_url || userData.avatarUrl || "",
        });

        setNameInput(userData.full_name || "");
      } catch (err) {
        setErrorMsg(err.response?.data?.message || "Không tải được thông tin.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [userFromRedux.user_id]);

  // Auto-save tên hiển thị khi blur/Enter (giữ nguyên)
  const handleNameSave = async () => {
    const trimmedName = nameInput.trim();
    if (!user.user_id || trimmedName === user.full_name || !trimmedName) return;

    setIsSaving(true);
    setErrorMsg("");
    setSuccessMsg("");

    try {
      const payload = { full_name: trimmedName };
      const result = await updateProfile(user.user_id, payload);
      const updated = result.data || {};

      setUser((prev) => ({ ...prev, full_name: updated.full_name || trimmedName }));
      setSuccessMsg("Đã cập nhật tên hiển thị");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Cập nhật tên thất bại");
      setNameInput(user.full_name);
    } finally {
      setIsSaving(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      nameInputRef.current?.blur();
    }
  };

  // Upload avatar (giữ nguyên)
  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith("image/")) {
      setErrorMsg("Vui lòng chọn file ảnh");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setPreviewAvatar(previewUrl);
    uploadAvatar(file);
  };

  const uploadAvatar = async (file) => {
    setIsSaving(true);
    const formData = new FormData();
    formData.append("images", file);

    try {
      const result = await updateAvatar(user.user_id, formData);
      const updated = result.data || {};
      setUser((prev) => ({
        ...prev,
        avatarUrl: updated.avatar_url || previewAvatar,
      }));
      setSuccessMsg("Đã cập nhật avatar");
    } catch (err) {
      setErrorMsg(err.response?.data?.message || "Cập nhật avatar thất bại");
      setPreviewAvatar(null);
    } finally {
      setIsSaving(false);
    }
  };

  // ─── Xử lý đổi mật khẩu ───
  const handleChangePassword = async () => {
    setPasswordError("");
    setErrorMsg("");
    setSuccessMsg("");

    // Validate frontend
    if (!oldPassword || !newPassword || !confirmPassword) {
      setPasswordError("Vui lòng điền đầy đủ các trường");
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("Mật khẩu mới và xác nhận không khớp");
      return;
    }

    if (newPassword.length < 6) {
      setPasswordError("Mật khẩu mới phải có ít nhất 6 ký tự");
      return;
    }

    setIsSaving(true);

    try {
      const payload = {
        user_id: user.user_id,
        password: oldPassword,
        newPassword: newPassword,
      };

      const result = await changePassword(payload);

      setSuccessMsg("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      // Reset form
      setOldPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setShowChangePassword(false);

      // Tùy chọn: logout sau 2 giây (nếu bạn có action logout)
      // setTimeout(() => dispatch(logout()), 2000);
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || "Đổi mật khẩu thất bại";
      if (errMsg.includes("Password không đúng")) {
        setPasswordError("Mật khẩu cũ không đúng");
      } else {
        setErrorMsg(errMsg);
      }
    } finally {
      setIsSaving(false);
    }
  };

  const currentAvatar = previewAvatar || user.avatarUrl || "/default-avatar.png";

  if (isLoading) {
    return <div className="flex-1 flex items-center justify-center">Đang tải...</div>;
  }

  return (
    <main className="flex-1 flex flex-col bg-background-light h-full relative min-w-0">
      <header className="h-[72px] shrink-0 border-b border-border-light flex items-center justify-between px-8 bg-white/95 backdrop-blur-sm sticky top-0 z-10">
        <h3 className="text-text-main text-lg font-bold">Tài khoản</h3>
        <button className="size-8 flex items-center justify-center rounded-full text-text-secondary hover:bg-gray-100">
          <span className="material-symbols-outlined text-[24px]">close</span>
        </button>
      </header>

      <div className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full">
        {errorMsg && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {errorMsg}
          </div>
        )}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 text-green-700 rounded-xl">
            {successMsg}
          </div>
        )}

        {/* Profile Banner & Avatar */}
        <div className="rounded-2xl bg-white mb-8 overflow-hidden shadow-lg border border-border-light">
          <div className="h-32 w-full bg-gradient-to-r from-blue-100 via-purple-100 to-pink-100" />

          <div className="px-6 pb-6 relative">
            <div className="flex justify-between items-end -mt-10 mb-4">
              <div className="relative">
                <div
                  className="size-24 rounded-full border-4 border-white bg-cover bg-center shadow-md"
                  style={{ backgroundImage: `url("${currentAvatar}")` }}
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isSaving}
                  className="absolute bottom-0 right-0 size-8 bg-white hover:bg-gray-50 border rounded-full flex items-center justify-center shadow-lg disabled:opacity-50"
                >
                  <span className="material-symbols-outlined text-[14px]">photo_camera</span>
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            <div>
              <h2 className="text-xl font-bold text-text-main">{user.full_name}</h2>
              <p className="text-text-secondary text-sm font-mono mt-1">@{user.username}</p>
            </div>
          </div>
        </div>

        {/* Form chỉnh sửa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-10">
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">
                Tên hiển thị
              </label>
              <div className="relative">
                <input
                  ref={nameInputRef}
                  className="w-full bg-white border border-border-light focus:border-primary focus:ring-1 focus:ring-primary rounded-xl px-4 py-3 text-text-main text-sm transition-all shadow-sm"
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  onBlur={handleNameSave}
                  onKeyDown={handleKeyDown}
                  placeholder="Nhập tên hiển thị"
                  disabled={isSaving}
                />
                {isSaving && (
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-primary text-sm">
                    Đang lưu...
                  </span>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">Email</label>
              <input
                className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-text-secondary text-sm cursor-not-allowed"
                disabled
                value={user.email}
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">
                Số điện thoại
              </label>
              <input
                className="w-full bg-gray-50 border rounded-xl px-4 py-3 text-text-secondary text-sm cursor-not-allowed"
                disabled
                value={user.phone || "Chưa cập nhật"}
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-text-secondary uppercase mb-2">
                Mật khẩu
              </label>
              <button
                onClick={() => setShowChangePassword(true)}
                className="w-full text-left px-4 py-3 bg-white hover:bg-gray-50 border border-border-light rounded-xl text-primary text-sm font-medium transition-all shadow-sm"
              >
                Thay đổi mật khẩu
              </button>
            </div>
          </div>
        </div>

        <hr className="border-border-light mb-10" />

        {/* Modal đổi mật khẩu */}
        {showChangePassword && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 shadow-2xl">
              <h3 className="text-lg font-bold mb-6">Thay đổi mật khẩu</h3>

              {passwordError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {passwordError}
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu hiện tại
                  </label>
                  <input
                    type="password"
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Nhập mật khẩu cũ"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Nhập mật khẩu mới"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Xác nhận mật khẩu mới
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:border-primary focus:ring-1 focus:ring-primary"
                    placeholder="Nhập lại mật khẩu mới"
                  />
                </div>
              </div>

              <div className="mt-8 flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowChangePassword(false);
                    setPasswordError("");
                    setOldPassword("");
                    setNewPassword("");
                    setConfirmPassword("");
                  }}
                  className="px-5 py-2.5 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition"
                >
                  Hủy
                </button>
                <button
                  onClick={handleChangePassword}
                  disabled={isSaving}
                  className={`px-5 py-2.5 text-sm font-medium text-white rounded-lg transition ${
                    isSaving
                      ? "bg-gray-400 cursor-not-allowed"
                      : "bg-primary hover:bg-blue-700"
                  }`}
                >
                  {isSaving ? "Đang xử lý..." : "Xác nhận"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default ProfilePage;
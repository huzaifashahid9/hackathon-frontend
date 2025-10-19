import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../store/slices/authSlice";
import { getReports } from "../store/slices/reportSlice";
import { getVitals } from "../store/slices/vitalsSlice";
import {
  fetchFamilyMembers,
  setSelectedMember,
  createFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
} from "../store/slices/familyMemberSlice";
import {
  FileText,
  Activity,
  Upload,
  LogOut,
  User,
  Calendar,
  TrendingUp,
  Users,
  Plus,
  Edit,
  Trash2,
  X,
} from "lucide-react";
import toast from "react-hot-toast";

const Dashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const { reports, loading: reportsLoading } = useSelector(
    (state) => state.reports
  );
  const { vitals, loading: vitalsLoading } = useSelector(
    (state) => state.vitals
  );
  const {
    members,
    selectedMember,
    loading: membersLoading,
  } = useSelector((state) => state.familyMembers);

  const [showMemberModal, setShowMemberModal] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: "",
    relationship: "",
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",
  });

  useEffect(() => {
    dispatch(fetchFamilyMembers());
  }, [dispatch]);

  useEffect(() => {
    if (selectedMember) {
      dispatch(getReports({ familyMemberId: selectedMember._id, limit: 5 }));
      dispatch(getVitals({ familyMemberId: selectedMember._id, limit: 5 }));
    }
  }, [dispatch, selectedMember]);

  const handleLogout = async () => {
    await dispatch(logout());
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleMemberSelect = (member) => {
    dispatch(setSelectedMember(member));
  };

  const handleAddMember = () => {
    setEditingMember(null);
    setMemberForm({
      name: "",
      relationship: "",
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",
    });
    setShowMemberModal(true);
  };

  const handleEditMember = (member) => {
    setEditingMember(member);
    setMemberForm({
      name: member.name,
      relationship: member.relationship,
      dateOfBirth: member.dateOfBirth?.split("T")[0] || "",
      gender: member.gender,
      bloodGroup: member.bloodGroup || "",
    });
    setShowMemberModal(true);
  };

  const handleDeleteMember = async (memberId) => {
    if (window.confirm("Are you sure you want to delete this family member?")) {
      try {
        await dispatch(deleteFamilyMember(memberId)).unwrap();
        toast.success("Family member deleted successfully");
      } catch (error) {
        toast.error(error || "Failed to delete family member");
      }
    }
  };

  const handleSubmitMember = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      Object.keys(memberForm).forEach((key) => {
        if (memberForm[key]) {
          formData.append(key, memberForm[key]);
        }
      });

      if (editingMember) {
        await dispatch(
          updateFamilyMember({ id: editingMember._id, formData })
        ).unwrap();
        toast.success("Family member updated successfully");
      } else {
        await dispatch(createFamilyMember(formData)).unwrap();
        toast.success("Family member added successfully");
      }
      setShowMemberModal(false);
    } catch (error) {
      toast.error(error || "Failed to save family member");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <Link to="/dashboard" className="flex items-center gap-2">
            <div className="bg-sky-100 p-2 rounded-lg">
              <FileText className="w-6 h-6 text-sky-500" />
            </div>
            <span className="text-2xl font-bold">
              <span className="text-sky-500">Health </span>Mate
            </span>
          </Link>
          <div className="flex items-center gap-4">
            <span className="text-gray-700 font-medium hidden sm:block">
              {user?.name}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-500 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span className="hidden sm:block">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Apni sehat ka record yahan dekhen aur manage karein
          </p>
        </div>

        {/* Family Member Selector */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center gap-2">
              <Users className="w-6 h-6 text-purple-500" />
              <h2 className="text-xl font-bold text-gray-900">
                Family Members
              </h2>
            </div>
            <button
              onClick={handleAddMember}
              className="flex items-center gap-2 bg-purple-500 text-white px-4 py-2 rounded-lg hover:bg-purple-600 transition-colors"
            >
              <Plus className="w-5 h-5" />
              Add Member
            </button>
          </div>

          {membersLoading ? (
            <p className="text-gray-500 text-center py-4">Loading...</p>
          ) : members.length === 0 ? (
            <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500 mb-4">
                Apne family members add karein
              </p>
              <button
                onClick={handleAddMember}
                className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 transition-colors"
              >
                Add First Member
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {members.map((member) => (
                <div
                  key={member._id}
                  className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all ${
                    selectedMember?._id === member._id
                      ? "border-purple-500 bg-purple-50"
                      : "border-gray-200 hover:border-purple-300"
                  }`}
                  onClick={() => handleMemberSelect(member)}
                >
                  <div className="absolute top-2 right-2 flex gap-1">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditMember(member);
                      }}
                      className="p-1 bg-blue-100 text-blue-600 rounded hover:bg-blue-200"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteMember(member._id);
                      }}
                      className="p-1 bg-red-100 text-red-600 rounded hover:bg-red-200"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                  <div className="flex flex-col items-center text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mb-2">
                      {member.name.charAt(0).toUpperCase()}
                    </div>
                    <div className="font-semibold text-gray-900 text-sm">
                      {member.name}
                    </div>
                    <div className="text-xs text-gray-500 capitalize">
                      {member.relationship}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {selectedMember && (
          <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl shadow-md p-6 mb-8 text-white">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold mb-1">
                  Viewing records for: {selectedMember.name}
                </h3>
                <p className="text-purple-100">
                  {selectedMember.relationship} {selectedMember.gender}
                </p>
              </div>
              <div className="text-3xl">
                {selectedMember.gender === "male"
                  ? "👨"
                  : selectedMember.gender === "female"
                  ? "👩"
                  : "🧑"}
              </div>
            </div>
          </div>
        )}

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <Link
            to="/upload"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-sky-500 group"
          >
            <div className="bg-sky-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-sky-500 transition-colors">
              <Upload className="w-8 h-8 text-sky-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              Upload Report
            </h3>
            <p className="text-gray-600">
              Lab report ya prescription upload karein
            </p>
          </Link>

          <Link
            to="/add-vitals"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-emerald-500 group"
          >
            <div className="bg-emerald-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-emerald-500 transition-colors">
              <Activity className="w-8 h-8 text-emerald-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Add Vitals</h3>
            <p className="text-gray-600">
              BP, sugar, weight manually add karein
            </p>
          </Link>

          <Link
            to="/timeline"
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all border-2 border-transparent hover:border-amber-500 group"
          >
            <div className="bg-amber-100 p-3 rounded-lg w-fit mb-4 group-hover:bg-amber-500 transition-colors">
              <Calendar className="w-8 h-8 text-amber-500 group-hover:text-white" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              View Timeline
            </h3>
            <p className="text-gray-600">Apni puri health history dekhein</p>
          </Link>
        </div>

        {/* Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-br from-sky-500 to-sky-600 p-6 rounded-xl text-white">
            <FileText className="w-8 h-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold">{reports.length}</div>
            <div className="text-sky-100">Total Reports</div>
          </div>
          <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 p-6 rounded-xl text-white">
            <Activity className="w-8 h-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold">{vitals.length}</div>
            <div className="text-emerald-100">Vital Records</div>
          </div>
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 p-6 rounded-xl text-white">
            <TrendingUp className="w-8 h-8 mb-2 opacity-80" />
            <div className="text-3xl font-bold">
              {reports.length + vitals.length}
            </div>
            <div className="text-amber-100">Total Entries</div>
          </div>
        </div>

        {/* Recent Reports */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Reports</h2>
            <Link
              to="/timeline"
              className="text-sky-500 hover:text-sky-600 font-medium"
            >
              View All →
            </Link>
          </div>
          {reportsLoading ? (
            <p className="text-gray-500 text-center py-8">Loading...</p>
          ) : reports.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No reports yet. Upload your first report!
            </p>
          ) : (
            <div className="space-y-3">
              {reports.slice(0, 5).map((report) => (
                <Link
                  key={report._id}
                  to={`/report/${report._id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-sky-500 hover:bg-sky-50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-sky-100 p-2 rounded">
                      <FileText className="w-5 h-5 text-sky-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {report.title}
                      </div>
                      <div className="text-sm text-gray-500">
                        {report.reportType}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(report.reportDate)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Recent Vitals */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-900">Recent Vitals</h2>
            <Link
              to="/timeline"
              className="text-emerald-500 hover:text-emerald-600 font-medium"
            >
              View All →
            </Link>
          </div>
          {vitalsLoading ? (
            <p className="text-gray-500 text-center py-8">Loading...</p>
          ) : vitals.length === 0 ? (
            <p className="text-gray-500 text-center py-8">
              No vitals yet. Add your first entry!
            </p>
          ) : (
            <div className="space-y-3">
              {vitals.slice(0, 5).map((vital) => (
                <Link
                  key={vital._id}
                  to={`/vital/${vital._id}`}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:border-green-500 hover:bg-sky-50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div className="bg-emerald-100 p-2 rounded">
                      <Activity className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        {vital.bloodPressure &&
                          `BP: ${vital.bloodPressure.systolic}/${vital.bloodPressure.diastolic}`}
                        {vital.bloodSugar &&
                          ` | Sugar: ${vital.bloodSugar.value}`}
                        {vital.weight && ` | Weight: ${vital.weight.value}kg`}
                      </div>
                      <div className="text-sm text-gray-500">
                        {vital.notes || "No notes"}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-gray-500">
                    {formatDate(vital.recordDate)}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit Member Modal */}
      {showMemberModal && (
        <div
          className="fixed inset-0 bg-opacity-50 flex items-center justify-center z-50 p-4"
          style={{ background: "rgba(0,0,0,0.5)" }}
        >
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 flex justify-between items-center">
              <h3 className="text-2xl font-bold text-gray-900">
                {editingMember ? "Edit" : "Add"} Family Member
              </h3>
              <button
                onClick={() => setShowMemberModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmitMember} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Name *
                </label>
                <input
                  type="text"
                  required
                  value={memberForm.name}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, name: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Relationship *
                </label>
                <select
                  required
                  value={memberForm.relationship}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      relationship: e.target.value,
                    })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select relationship</option>
                  <option value="self">Self (Khud)</option>
                  <option value="spouse">Spouse (Husband/Wife)</option>
                  <option value="son">Son (Beta)</option>
                  <option value="daughter">Daughter (Beti)</option>
                  <option value="father">Father (Walid)</option>
                  <option value="mother">Mother (Walida)</option>
                  <option value="brother">Brother (Bhai)</option>
                  <option value="sister">Sister (Behan)</option>
                  <option value="grandfather">Grandfather (Dada/Nana)</option>
                  <option value="grandmother">Grandmother (Dadi/Nani)</option>
                  <option value="grandson">Grandson (Pota/Nawasa)</option>
                  <option value="granddaughter">
                    Granddaughter (Poti/Nawasi)
                  </option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="date"
                  required
                  value={memberForm.dateOfBirth}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      dateOfBirth: e.target.value,
                    })
                  }
                  max={new Date().toISOString().split("T")[0]}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  required
                  value={memberForm.gender}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, gender: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select gender</option>
                  <option value="male">Male (Mard)</option>
                  <option value="female">Female (Aurat)</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Blood Group
                </label>
                <select
                  value={memberForm.bloodGroup}
                  onChange={(e) =>
                    setMemberForm({ ...memberForm, bloodGroup: e.target.value })
                  }
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="">Select blood group</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowMemberModal(false)}
                  className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={membersLoading}
                  className="flex-1 px-6 py-3 bg-purple-500 text-white rounded-lg hover:bg-purple-600 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {membersLoading
                    ? "Saving..."
                    : editingMember
                    ? "Update"
                    : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

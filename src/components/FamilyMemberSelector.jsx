import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchFamilyMembers,
  setSelectedMember,
} from "../store/slices/familyMemberSlice";
import { Link } from "react-router-dom";

const FamilyMemberSelector = ({ value, onChange, required = true }) => {
  const dispatch = useDispatch();
  const { members, loading } = useSelector((state) => state.familyMembers);

  useEffect(() => {
    if (members.length === 0) {
      dispatch(fetchFamilyMembers());
    }
  }, [dispatch, members.length]);

  const handleChange = (e) => {
    const memberId = e.target.value;
    const member = members.find((m) => m._id === memberId);
    if (member) {
      dispatch(setSelectedMember(member));
    }
    if (onChange) {
      onChange(memberId);
    }
  };

  if (loading) {
    return (
      <div className="border border-gray-300 rounded-lg px-4 py-2 bg-gray-50">
        <p className="text-gray-500">Loading family members...</p>
      </div>
    );
  }

  if (members.length === 0) {
    return (
      <div className="border border-yellow-300 rounded-lg px-4 py-3 bg-yellow-50">
        <p className="text-yellow-800 mb-2">
          No family members found. Please add a family member first.
        </p>
        <Link
          to="/dashboard"
          className="text-purple-600 hover:text-purple-700 font-medium"
        >
          → Go to Dashboard to Add Members
        </Link>
      </div>
    );
  }

  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        Select Family Member {required && <span className="text-red-500">*</span>}
      </label>
      <select
        value={value || ""}
        onChange={handleChange}
        required={required}
        className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-green-500 focus:border-transparent"
      >
        <option value="">-- Choose a family member --</option>
        {members.map((member) => (
          <option key={member._id} value={member._id}>
            {member.name} ({member.relationship})
          </option>
        ))}
      </select>
      <p className="text-xs text-gray-500 mt-1">
        Don't see the person?{" "}
        <Link
          to="/dashboard"
          className="text-purple-600 hover:text-purple-700"
        >
          Add in Dashboard
        </Link>
      </p>
    </div>
  );
};

export default FamilyMemberSelector;

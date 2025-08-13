import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Building, 
  Calendar,
  Settings,
  Shield,
  Bell,
  CreditCard,
  Save,
  Edit
} from 'lucide-react';

const Profile: React.FC = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [userData, setUserData] = useState({
    name: 'John Doe',
    email: 'john.doe@innosolve.com',
    phone: '+1 (555) 123-4567',
    company: 'Innosolve',
    position: 'Business Owner',
    location: 'San Francisco, CA',
    joinDate: 'January 2024',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face'
  });

  const [formData, setFormData] = useState(userData);

  const handleSave = () => {
    setUserData(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userData);
    setIsEditing(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 space-y-6"
    >
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Profile</h1>
          <p className="text-gray-600 mt-1">Manage your account settings and preferences</p>
        </div>
        <div className="flex gap-3">
          {isEditing ? (
            <>
              <button onClick={handleCancel} className="btn-secondary">
                Cancel
              </button>
              <button onClick={handleSave} className="btn-primary flex items-center gap-2">
                <Save className="w-4 h-4" />
                Save Changes
              </button>
            </>
          ) : (
            <button onClick={() => setIsEditing(true)} className="btn-primary flex items-center gap-2">
              <Edit className="w-4 h-4" />
              Edit Profile
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="lg:col-span-1">
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="card text-center"
          >
            <div className="relative inline-block">
              <img
                src={userData.avatar}
                alt="Profile"
                className="w-32 h-32 rounded-full mx-auto mb-4 object-cover border-4 border-white shadow-lg"
              />
              {isEditing && (
                <button className="absolute bottom-4 right-4 bg-primary-600 text-white p-2 rounded-full hover:bg-primary-700 transition-colors">
                  <Edit className="w-4 h-4" />
                </button>
              )}
            </div>
            
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="text-center bg-transparent border-b border-gray-300 focus:border-primary-500 focus:outline-none"
                />
              ) : (
                userData.name
              )}
            </h2>
            
            <p className="text-gray-600 mb-4">
              {isEditing ? (
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => setFormData({...formData, position: e.target.value})}
                  className="text-center bg-transparent border-b border-gray-300 focus:border-primary-500 focus:outline-none"
                />
              ) : (
                userData.position
              )}
            </p>

            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex items-center justify-center gap-2">
                <Building className="w-4 h-4" />
                <span>{userData.company}</span>
              </div>
              <div className="flex items-center justify-center gap-2">
                <Calendar className="w-4 h-4" />
                <span>Member since {userData.joinDate}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal Information */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-primary-600" />
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-700">Email</label>
                <div className="flex items-center gap-2 mt-1">
                  <Mail className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="input-field"
                    />
                  ) : (
                    <span className="text-gray-900">{userData.email}</span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Phone</label>
                <div className="flex items-center gap-2 mt-1">
                  <Phone className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                      className="input-field"
                    />
                  ) : (
                    <span className="text-gray-900">{userData.phone}</span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Location</label>
                <div className="flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({...formData, location: e.target.value})}
                      className="input-field"
                    />
                  ) : (
                    <span className="text-gray-900">{userData.location}</span>
                  )}
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700">Company</label>
                <div className="flex items-center gap-2 mt-1">
                  <Building className="w-4 h-4 text-gray-400" />
                  <span className="text-gray-900">{userData.company}</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Account Settings */}
          <motion.div
            whileHover={{ scale: 1.01 }}
            className="card"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <Settings className="w-5 h-5 text-primary-600" />
              Account Settings
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Bell className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Notifications</p>
                    <p className="text-sm text-gray-600">Manage your notification preferences</p>
                  </div>
                </div>
                <button className="btn-secondary">Configure</button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Security</p>
                    <p className="text-sm text-gray-600">Password and security settings</p>
                  </div>
                </div>
                <button className="btn-secondary">Manage</button>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <CreditCard className="w-5 h-5 text-gray-600" />
                  <div>
                    <p className="font-medium text-gray-900">Billing</p>
                    <p className="text-sm text-gray-600">Subscription and payment information</p>
                  </div>
                </div>
                <button className="btn-secondary">View</button>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Profile; 
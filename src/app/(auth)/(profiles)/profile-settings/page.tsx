import React from 'react'

const ProfileSetting = () => {
  return (
      <div className='w-full'>
        <h1 className="text-center text-2xl font-bold mt-10">Profile Settings</h1>
        <div className="mx-auto mt-6 p-4 bg-white rounded-lg shadow-md">
          <form>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Username</label>
              <input
                type="text"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your username"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter your email"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition duration-200"
            >
              Save Changes
            </button>
          </form>
        </div>
    </div>
  )
}

export default ProfileSetting
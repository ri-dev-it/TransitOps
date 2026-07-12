import React from 'react';

const StatCard = ({ title, value, icon, color }) => {
    return (
        <div className="bg-white rounded-lg shadow p-6 flex items-center">
            <div className={`p-4 rounded-full text-white ${color} mr-4`}>
                {icon}
            </div>
            <div>
                <p className="text-sm text-gray-500 uppercase font-semibold">{title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
            </div>
        </div>
    );
};

export default StatCard;
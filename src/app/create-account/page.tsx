"use client";

import { useState, useCallback } from "react";
import * as types from "~/types/user";

const Page = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [weightUnit, setWeightUnit] = useState<types.weightUnitType>("kg");
  const [heightUnit, setHeightUnit] = useState<types.heightUnitType>("cm");
  const [username, setUsername] = useState<string>("");
  const [dailyCardio, setDailyCardio] = useState('');
  const [dailyWeightTraining, setDailyWeightTraining] = useState('');
  const [dailyMeditation, setDailyMeditation] = useState('');
  const [dailyWaterIntake, setDailyWaterIntake] = useState('');
  const [userData, setUserData] = useState<types.userDataType>();
  const [isSecondPage, setIsSecondPage] = useState(false);

  const handleSubmit = useCallback(async () => {
    const userData: types.userDataType = {
      username,
      weightUnit,
      heightUnit,
      weight: Number(weight),
      height: Number(height),
      startData: {
        dailyWeightTraining: Number(dailyWeightTraining),
        dailyCardio: Number(dailyCardio),
        dailyMeditation: Number(dailyMeditation),
        dailyWaterIntake: Number(dailyWaterIntake),
      },
    };

    setUserData(userData);

    try {
      const response = await fetch("/api/user/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        throw new Error("response not ok");
      }

      const result = await response.json();
      console.log("Success! :", result);
    } catch (e) {
      console.error("Error..:", e);
    }
  }, [username, weightUnit, heightUnit, weight, height, dailyWeightTraining, dailyCardio, dailyMeditation, dailyWaterIntake]);

  const handleNext = useCallback(() => {
    const initialUserData: types.userDataType = {
      username,
      weightUnit,
      heightUnit,
      weight: Number(weight),
      height: Number(height),
      startData: {
        dailyWeightTraining: 0,
        dailyCardio: 0,
        dailyMeditation: 0,
        dailyWaterIntake: 0,
      },
    };
    setUserData(initialUserData);
    setIsSecondPage(true);
  }, [username, weightUnit, heightUnit, weight, height]);

  const renderFirstPage = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleNext();
      }}
      className="space-y-4"
    >
      {/* Username Field */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-white">Username</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mt-1 p-2 border border-gray-300 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Weight Field */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-white">Weight</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1 p-2 border border-gray-300 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />
          <select
            value={weightUnit}
            onChange={(e) =>
              setWeightUnit(e.target.value as types.weightUnitType)
            }
            className="mt-1 p-2 border border-gray-300 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="kg">kg</option>
            <option value="lb">lb</option>
          </select>
        </div>
      </div>

      {/* Height Field */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-white">Height</label>
        <div className="flex gap-2">
          <input
            type="number"
            value={height}
            onChange={(e) => setHeight(e.target.value)}
            className="mt-1 p-2 border border-gray-300 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 flex-1"
          />
          <select
            value={heightUnit}
            onChange={(e) =>
              setHeightUnit(e.target.value as types.heightUnitType)
            }
            className="mt-1 p-2 border border-gray-300 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="cm">cm</option>
            <option value="in">in</option>
          </select>
        </div>
      </div>

      {/* Next Button */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Next
      </button>
    </form>
  );

  const renderSecondPage = () => (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        handleSubmit();
      }}
      className="space-y-4"
    >
      {/* Daily Cardio Field */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-white">Daily Cardio Training</label>
        <input
          type="number"
          value={dailyCardio}
          onChange={(e) => setDailyCardio(e.target.value)}
          className="mt-1 p-2 border border-gray-300 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Daily Weight Training Field */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-white">Daily Weight Training</label>
        <input
          type="number"
          value={dailyWeightTraining}
          onChange={(e) => setDailyWeightTraining(e.target.value)}
          className="mt-1 p-2 border border-gray-300 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Daily Meditation Field */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-white">Daily Meditation</label>
        <input
          type="number"
          value={dailyMeditation}
          onChange={(e) => setDailyMeditation(e.target.value)}
          className="mt-1 p-2 border border-gray-300 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Daily Water Intake Field */}
      <div className="flex flex-col">
        <label className="text-sm font-medium text-white">Daily Water Intake</label>
        <input
          type="number"
          value={dailyWaterIntake}
          onChange={(e) => setDailyWaterIntake(e.target.value)}
          className="mt-1 p-2 border border-gray-300 bg-black rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        className="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        Submit
      </button>
    </form>
  );

  return (
    <div className="flex flex-col items-center justify-center min-h-screen w-full bg-black">
      <div className="w-full max-w-md p-6 bg-black rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6 text-white">Register</h1>
        {isSecondPage ? renderSecondPage() : renderFirstPage()}
      </div>
    </div>
  );
};

export default Page;

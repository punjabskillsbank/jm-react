import React, { useEffect, useState } from "react";
import {
  Box,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getPendingFreelancers } from "../../services/freelancerService";
const [loading, setLoading] = useState(true);

export default function PendingFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);

  // All available columns
  const allColumns = [
    { field: "freelancerId", headerName: "ID", width: 250 },
    { field: "title", headerName: "Title", width: 150 },
    { field: "bio", headerName: "Bio", width: 200 },
    { field: "hourlyRate", headerName: "Hourly Rate", width: 120 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "city", headerName: "City", width: 120 },
    { field: "state", headerName: "State", width: 120 },
    { field: "country", headerName: "Country", width: 120 },
    { field: "postalCode", headerName: "Postal Code", width: 120 },
    { field: "phoneNumber", headerName: "Phone", width: 150 },
    { field: "isAbcMember", headerName: "ABC Member", width: 150 },
    { field: "profileStatus", headerName: "Profile Status", width: 150 },
  ];

  // Fetch pending freelancers
useEffect(() => {
  const fetchData = async () => {
    try {
      const data = await getPendingFreelancers();
      setFreelancers(data || []);
    } catch (error) {
      console.error("Error fetching freelancers:", error);
    } finally {
      setLoading(false);
    }
  };
  fetchData();
}, []);

  // Handle column checkbox change
  const handleColumnChange = (field) => {
    setSelectedColumns((prev) =>
      prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field]
    );
  };

  // Build final columns based on selection
  const finalColumns = allColumns.filter((col) =>
    selectedColumns.includes(col.field)
  );

  return (
    <div className="flex flex-col md:flex-row gap-6 p-6">
      {/* Left Section - Column Selector */}
      <div className="w-full md:w-1/3 bg-blue-100 rounded-xl shadow p-4">
        <h2 className="text-xl font-bold text-blue-700 mb-4">Select Columns</h2>
        {allColumns.map((col) => (
          <FormControlLabel
            key={col.field}
            control={
              <Checkbox
                checked={selectedColumns.includes(col.field)}
                onChange={() => handleColumnChange(col.field)}
                sx={{
                  color: "#1d4ed8", // Tailwind blue-700
                  "&.Mui-checked": { color: "#1d4ed8" },
                }}
              />
            }
            label={
              <span className="text-blue-900 font-medium">{col.headerName}</span>
            }
          />
        ))}
      </div>

      {/* Right Section - Data Grid */}
      <div className="w-full md:w-2/3 bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Pending Freelancers
        </h2>
        <div className="h-[600px]">
          {finalColumns.length === 0 ? (
            // Show placeholder if no columns selected
            <Paper
              elevation={0}
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "gray",
                fontSize: "16px",
                fontWeight: 500,
              }}
            >
              Please select at least one column to display data.
            </Paper>
          ) : (
            <DataGrid
              rows={freelancers}
              columns={finalColumns}
              getRowId={(row) => row.freelancerId}
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          )}
        </div>
      </div>
    </div>
  );
}

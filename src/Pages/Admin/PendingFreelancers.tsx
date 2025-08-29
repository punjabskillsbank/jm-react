import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Paper,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getPendingFreelancers } from "../../services/freelancerService"; // your service

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

export default function PendingFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [finalColumns, setFinalColumns] = useState([]);

  // Fetch data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPendingFreelancers();
        setFreelancers(data);
      } catch (error) {
        console.error("Error fetching freelancers:", error);
      }
    };
    fetchData();
  }, []);

  // Handle column selection
  const handleColumnChange = (field) => {
    setSelectedColumns((prev) =>
      prev.includes(field) ? prev.filter((f) => f !== field) : [...prev, field]
    );
  };

  // Create table with selected columns
  const handleCreateTable = () => {
    const cols = allColumns.filter((col) => selectedColumns.includes(col.field));
    setFinalColumns(cols);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4 p-4">
      {/* Left Section */}
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
                  color: "#1d4ed8", // blue-700
                  "&.Mui-checked": {
                    color: "#1d4ed8",
                  },
                }}
              />
            }
            label={
              <span className="text-blue-900 font-medium">{col.headerName}</span>
            }
          />
        ))}
        <Box mt={2}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleCreateTable}
            disabled={selectedColumns.length === 0}
            sx={{
              backgroundColor: "#1d4ed8",
              "&:hover": { backgroundColor: "#1e40af" },
            }}
          >
            Create Table
          </Button>
        </Box>
      </div>

      {/* Right Section */}
      <div className="w-full md:w-2/3 bg-white rounded-xl shadow p-4">
        <h2 className="text-xl font-bold text-gray-800 mb-4">
          Pending Freelancers
        </h2>
        <div className="h-[600px]">
          <DataGrid
            rows={freelancers}
            columns={finalColumns}
            getRowId={(row) => row.freelancerId}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 5, page: 0 },
              },
            }}
            pageSizeOptions={[5, 10, 20]}
            disableRowSelectionOnClick
          />
        </div>
      </div>
    </div>
  );
}

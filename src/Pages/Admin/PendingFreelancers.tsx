import React, { useEffect, useState } from "react";
import {
  Checkbox,
  FormControlLabel,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { getPendingFreelancers } from "../../services/AdminService";

export default function PendingFreelancers() {
  const [freelancers, setFreelancers] = useState([]);
  const [allColumns, setAllColumns] = useState([]);
  const [selectedColumns, setSelectedColumns] = useState([]);
  const [loading, setLoading] = useState(true);

  // 🔹 For popup state
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await getPendingFreelancers();
       

        if (Array.isArray(data) && data.length > 0) {
          setFreelancers(data);

          const dynamicCols = Object.keys(data[0]).map((key) => ({
            field: key,
            headerName: key.charAt(0).toUpperCase() + key.slice(1),
            width: 180,
          }));
          setAllColumns(dynamicCols);
          setSelectedColumns(dynamicCols.map((col) => col.field));
        }
      } catch (error) {
        console.error("❌ Error fetching freelancers:", error);
        setFreelancers([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleColumnChange = (field: string) => {
    setSelectedColumns((prev) =>
      prev.includes(field)
        ? prev.filter((col) => col !== field)
        : [...prev, field]
    );
  };

  const finalColumns = allColumns.filter((col) =>
    selectedColumns.includes(col.field)
  );

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Top Bar with Button */}
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-bold text-gray-800">
          Pending Freelancers
        </h2>
        <Button
          variant="contained"
          color="primary"
          onClick={() => setOpen(true)}
        >
          Select Columns
        </Button>
      </div>

      {/* Full Width DataGrid */}
      <div className="w-full bg-white rounded-xl shadow p-4">
        <div className="h-[600px]">
          {finalColumns.length === 0 ? (
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
              You don't have any Pending Freelancer Right Now.
            </Paper>
          ) : (
            <DataGrid
              rows={freelancers}
              columns={finalColumns}
              getRowId={(row) => row.freelancerId || row.id}
              initialState={{
                pagination: { paginationModel: { pageSize: 5, page: 0 } },
              }}
              pageSizeOptions={[5, 10, 20]}
              disableRowSelectionOnClick
            />
          )}
        </div>
      </div>

      {/* Popup Dialog for Column Selection */}
      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Columns</DialogTitle>
        <DialogContent dividers>
          <div className="flex flex-col space-y-2">
            {allColumns.map((col) => (
              <FormControlLabel
                key={col.field}
                control={
                  <Checkbox
                    checked={selectedColumns.includes(col.field)}
                    onChange={() => handleColumnChange(col.field)}
                  />
                }
                label={col.headerName}
              />
            ))}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} color="primary">
            Done
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

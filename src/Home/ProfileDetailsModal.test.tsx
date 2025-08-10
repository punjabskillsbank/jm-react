import "@testing-library/jest-dom";
import { render, screen, fireEvent } from "@testing-library/react";
import ProfileDetailsModal from "./ProfileDetailsModal";

// Mock URL.createObjectURL to avoid browser API errors in Jest
beforeAll(() => {
  global.URL.createObjectURL = jest.fn(() => "blob:mock-url");
});

describe("ProfileDetailsModal", () => {
  const baseSignupData = {
    name: "John Doe",
    title: "Web Developer",
    bio: "Experienced in React",
    email: "john@example.com",
    phone: "1234567890",
    country: "USA",
    address: "123 Street",
    city: "New York",
    state: "NY",
    zip: "10001",
    hourlyRate: 50,
    photo: new File(["dummy"], "photo.jpg", { type: "image/jpeg" }),
    isAbcMember: true,
    certificate: [
      {
        certificateName: "React Mastery",
        issuedBy: "Udemy",
        issueDate: "2024-01-01",
        expiryDate: "2025-01-01",
        credentialUrl: "https://example.com/cert",
      },
    ],
    education: [
      {
        degree: "BSc Computer Science",
        institute: "MIT",
        start_year: "2019",
        end_year: "2023",
        description: "Studied CS",
      },
    ],
    experience: [
      {
        title: "Frontend Dev",
        description: "Worked on UI",
        budget_type: "hourly",
        hourly_min_rate: 20,
        hourly_max_rate: 40,
        project_duration: "3 months",
        experience_level: "Intermediate",
      },
    ],
  };

  const renderModal = (overrides = {}) => {
    const onClose = jest.fn();
    render(
      <ProfileDetailsModal
        signupData={{ ...baseSignupData, ...overrides }}
        timezone="UTC"
        onClose={onClose}
      />
    );
    return onClose;
  };

  test("renders modal with profile details", () => {
    renderModal();
    expect(screen.getByText(/Profile Details/i)).toBeInTheDocument();
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Web Developer")).toBeInTheDocument();
    expect(screen.getByText(/React Mastery/i)).toBeInTheDocument();
    expect(screen.getByText(/BSc Computer Science/i)).toBeInTheDocument();
    expect(screen.getByText(/Frontend Dev/i)).toBeInTheDocument();
  });

  test("calculates and displays completion percentage correctly", () => {
    renderModal();
    expect(screen.getByText(/Profile Completion:/)).toHaveTextContent(/100%/);
  });

  test("shows 'No photo uploaded' if no photo", () => {
    renderModal({ photo: null });
    expect(screen.getByText(/No photo uploaded/i)).toBeInTheDocument();
  });

  test("shows 'No certificates added' if no certificates", () => {
    renderModal({ certificate: [] });
    expect(screen.getByText(/No certificates added/i)).toBeInTheDocument();
  });

  test("shows 'No education added' if no education", () => {
    renderModal({ education: [] });
    expect(screen.getByText(/No education added/i)).toBeInTheDocument();
  });

  test("shows 'No experience added' if no experience", () => {
    renderModal({ experience: [] });
    expect(screen.getByText(/No experience added/i)).toBeInTheDocument();
  });

  test("calls onClose when close button is clicked", () => {
    const onClose = renderModal();
    const closeBtn = screen.getByRole("button");
    fireEvent.click(closeBtn);
    expect(onClose).toHaveBeenCalled();
  });

  
});

describe("ProfileDetailsModal progress bar color", () => {
  const baseData = {
    name: "",
    title: "",
    bio: "",
    email: "",
    phone: "",
    country: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    hourlyRate: "",
    photo: null,
    certificate: [],
    education: [],
    experience: [],
    isAbcMember: false
  };

  const timezone = "UTC";

  it("renders red when completion < 50%", () => {
    const redData = {
      ...baseData,
      name: "John", // 1 filled
      email: "test@example.com", // 2 filled
      timezone // This will be counted separately in calc
    };

    render(
      <ProfileDetailsModal signupData={redData} timezone={timezone} onClose={() => {}} />
    );

    expect(screen.getByRole("progressbar").className).toMatch(/bg-red-500/);
  });

  it("renders yellow when completion is between 50% and 80%", () => {
    const yellowData = {
      ...baseData,
      name: "John Doe",
      title: "Developer",
      bio: "Some bio",
      email: "test@example.com",
      phone: "1234567890",
      country: "USA",
      address: "123 Main St",
      hourlyRate: "50"
    };

    render(
      <ProfileDetailsModal signupData={yellowData} timezone={timezone} onClose={() => {}} />
    );

    expect(screen.getByRole("progressbar").className).toMatch(/bg-yellow-500/);
  });

  it("renders green when completion ≥ 80%", () => {
    const greenData = {
      ...baseData,
      name: "John Doe",
      title: "Senior Developer",
      bio: "Experienced developer",
      email: "test@example.com",
      phone: "1234567890",
      country: "USA",
      address: "123 Main St",
      city: "New York",
      state: "NY",
      zip: "10001",
      hourlyRate: "100",
      photo: new File([""], "photo.jpg", { type: "image/jpeg" }),
      certificate: [{ certificateName: "Cert1", issuedBy: "Org", issueDate: "2020", expiryDate: "2025" }],
      education: [{ degree: "BS", institute: "Uni", start_year: "2010", end_year: "2014", description: "CS" }],
      experience: [{ title: "Dev", description: "Worked", budget_type: "fixed", fixed_price: "1000", project_duration: "6 months", experience_level: "expert" }]
    };

    render(
      <ProfileDetailsModal signupData={greenData} timezone={timezone} onClose={() => {}} />
    );

    expect(screen.getByRole("progressbar").className).toMatch(/bg-green-500/);
  });
});

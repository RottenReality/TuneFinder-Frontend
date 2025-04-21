import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import Menu from "../components/Menu";
import { BrowserRouter } from "react-router-dom";

const dispatchMock = vi.fn();
const selectorMock = vi.fn();
const navigateMock = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => dispatchMock,
  useSelector: (fn) => fn({ user: selectorMock() }),
}));

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

beforeEach(() => {
  dispatchMock.mockReset();
  navigateMock.mockReset();
  selectorMock.mockReset();
  vi.stubGlobal("localStorage", {
    setItem: vi.fn(),
  });
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("Menu component", () => {
  it("renders all links when user is logged in", () => {
    selectorMock.mockReturnValue({ display_name: "Sierra" });

    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>,
    );

    expect(screen.getByText("home")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
    expect(screen.getByText("Sierra")).toBeInTheDocument();
  });

  it("does not show user-specific buttons when user is not logged in", () => {
    selectorMock.mockReturnValue(null);

    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>,
    );

    expect(screen.getByText("home")).toBeInTheDocument();
    expect(screen.getByText("Logout")).toBeInTheDocument();
  });

  it("calls logout logic when Logout button is clicked", () => {
    selectorMock.mockReturnValue({ display_name: "User" });

    render(
      <BrowserRouter>
        <Menu />
      </BrowserRouter>,
    );

    fireEvent.click(screen.getByText("Logout"));

    expect(dispatchMock).toHaveBeenCalled();
    expect(localStorage.setItem).toHaveBeenCalledWith("token", "");
    expect(navigateMock).toHaveBeenCalledWith("/");
  });
});

import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { render } from "@testing-library/react";
import Callback from "../components/Callback";
import MockAdapter from "axios-mock-adapter";
import axios from "axios";
import { MemoryRouter } from "react-router-dom";

const dispatchMock = vi.fn();

vi.mock("react-redux", () => ({
  useDispatch: () => dispatchMock,
}));

const navigateMock = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => navigateMock,
  };
});

describe("Callback component", () => {
  let mockAxios;

  beforeEach(() => {
    mockAxios = new MockAdapter(axios);
    mockAxios.reset();

    localStorage.clear();
    localStorage.setItem("code_verifier", "mocked-verifier");
    window.history.pushState({}, "", "/callback?code=mocked-code");

    dispatchMock.mockClear();
    navigateMock.mockClear();
  });

  afterEach(() => {
    mockAxios.restore();
  });

  it("fetches token, dispatches login and navigates", async () => {
    mockAxios.onPost("https://accounts.spotify.com/api/token").reply(200, {
      access_token: "mocked-token",
    });

    render(
      <MemoryRouter>
        <Callback />
      </MemoryRouter>,
    );

    await new Promise((r) => setTimeout(r, 50));

    expect(localStorage.getItem("token")).toBe("mocked-token");
    expect(dispatchMock).toHaveBeenCalled();
    expect(dispatchMock.mock.calls[0][0]).toBeInstanceOf(Function);
    expect(navigateMock).toHaveBeenCalledWith("/home");
  });
});

import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { vi } from "vitest";
import TreeNode from "../../components/TreeNode.jsx";
import NodeSelection from "../../components/NodeSelection.jsx";

let retrievalContext = {};
const resetContext = () => {
  retrievalContext = {
    retrievalInstructions: [],
    setKey: vi.fn(),
    deleteInstruction: vi.fn(),
  };
};

beforeEach(() => {
  resetContext();
});

vi.mock("../../context/RetrievalInstructionContext.jsx", () => ({
  useRetrievalInstructions: () => retrievalContext,
}));

// Mock query menu + builder to simple buttons
vi.mock("../../components/QueryAddMenu.jsx", () => ({
  default: ({ onQuickQuery }) => (
    <div>
      <button onClick={() => onQuickQuery("SCRAPE_THIS_NODE")}>select-node</button>
      <button onClick={() => onQuickQuery("SCRAPE_ALL_OF_TAG")}>select-all</button>
    </div>
  ),
}));

vi.mock("../../components/QueryBuilder.jsx", () => ({ default: () => null }));

vi.mock("../../utils/buildQuery.js", () => ({
  buildQuery: () => "QUERY",
}));

describe("Epic Two", () => {
  it("Feature 2.1: Click HTML tree elements to select them", async () => {
    const addInstruction = vi.fn();
    const node = { id: 1, tag_type: "div", position: 1, children: [], html_attributes: {}, raw: "" };

    render(
      <TreeNode node={node} addToInstructions={addInstruction} level={0} virtualized={false} />
    );

    await userEvent.click(screen.getByText(/select-node/i));
    expect(addInstruction).toHaveBeenCalled();
  });

  it("Feature 2.2: Assign property names via selection panel", async () => {
    retrievalContext = {
      retrievalInstructions: [
        {
          node_query: "QUERY",
          output: { key: "", location: "body" },
          _preview: { tag_type: "p" },
        },
      ],
      setKey: vi.fn(),
      deleteInstruction: vi.fn(),
    };

    render(<NodeSelection />);

    const keyInput = screen.getByPlaceholderText(/enter key/i);
    await userEvent.type(keyInput, "title");
    expect(retrievalContext.setKey).toHaveBeenCalled();
    await userEvent.click(screen.getByRole("button"));
    expect(retrievalContext.deleteInstruction).toHaveBeenCalledWith(0);
  });

  it("Feature 2.3: Select multiple similar elements at once", async () => {
    const addInstruction = vi.fn();
    const node = { id: 2, tag_type: "p", position: 1, children: [], html_attributes: {}, raw: "" };

    render(
      <TreeNode node={node} addToInstructions={addInstruction} level={0} virtualized={false} />
    );

    await userEvent.click(screen.getByText(/select-all/i));
    expect(addInstruction).toHaveBeenCalled();
    const payload = addInstruction.mock.calls[0][0];
    expect(payload.output.key).toBe("p");
  });
});

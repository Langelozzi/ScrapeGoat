import { render, screen } from '@testing-library/react';
import TestComponent from '../components/TestComponent';

describe('Test Component', () => {
  it('renders a greeting', () => {
    render(<TestComponent msg="Hello world!" />);
    expect(screen.getByText(/Test component: Hello world!/i)).toBeInTheDocument();
  });
});

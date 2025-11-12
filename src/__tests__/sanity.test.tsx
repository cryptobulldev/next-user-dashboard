import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';

function Hello() {
  return <h1>Hello Jest 👋</h1>;
}

describe('Sanity Test', () => {
  it('renders a hello message', () => {
    render(<Hello />);
    expect(screen.getByText('Hello Jest 👋')).toBeInTheDocument();
  });
});

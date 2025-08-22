import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import OptimizedImage from "@/components/OptimizedImage";

// Mock Next.js Image component
jest.mock("next/image", () => {
  return function MockImage(props: any) {
    const { 
      onError, 
      priority, 
      quality, 
      placeholder, 
      blurDataURL,
      style,
      ...domProps 
    } = props;
    
    return (
      <img
        {...domProps}
        onError={(e) => {
          if (onError) onError(e);
        }}
        data-testid="optimized-image"
        data-priority={priority ? "true" : "false"}
        data-quality={quality?.toString()}
        data-placeholder={placeholder}
        data-blur-data-url={blurDataURL}
      />
    );
  };
});

describe("OptimizedImage", () => {
  const defaultProps = {
    src: "/test-image.jpg",
    alt: "Test image",
    width: 100,
    height: 100,
  };

  it("renders with default props", () => {
    render(<OptimizedImage {...defaultProps} />);

    const image = screen.getByTestId("optimized-image");
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute("src", "/test-image.jpg");
    expect(image).toHaveAttribute("alt", "Test image");
  });

  it("renders with custom className", () => {
    render(<OptimizedImage {...defaultProps} className="custom-class" />);

    const image = screen.getByTestId("optimized-image");
    expect(image).toHaveClass("custom-class");
  });

  it("falls back to fallback source on error", () => {
    const fallbackSrc = "/fallback.jpg";
    render(<OptimizedImage {...defaultProps} fallbackSrc={fallbackSrc} />);

    const image = screen.getByTestId("optimized-image");

    // Trigger error
    fireEvent.error(image);

    expect(image).toHaveAttribute("src", fallbackSrc);
  });

  it("uses default fallback when no fallback provided", () => {
    render(<OptimizedImage {...defaultProps} />);

    const image = screen.getByTestId("optimized-image");

    // Trigger error
    fireEvent.error(image);

    expect(image).toHaveAttribute("src", "/img/logo.png");
  });

  it("does not change source on second error", () => {
    const fallbackSrc = "/fallback.jpg";
    render(<OptimizedImage {...defaultProps} fallbackSrc={fallbackSrc} />);

    const image = screen.getByTestId("optimized-image");

    // First error - should change to fallback
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", fallbackSrc);

    // Second error - should not change again
    fireEvent.error(image);
    expect(image).toHaveAttribute("src", fallbackSrc);
  });

  it("passes through priority prop", () => {
    render(<OptimizedImage {...defaultProps} priority={true} />);

    const image = screen.getByTestId("optimized-image");
    expect(image).toHaveAttribute("data-priority", "true");
  });

  it("passes through quality prop", () => {
    render(<OptimizedImage {...defaultProps} quality={90} />);

    const image = screen.getByTestId("optimized-image");
    expect(image).toHaveAttribute("data-quality", "90");
  });

  it("passes through placeholder props", () => {
    const blurDataURL = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQ";
    render(
      <OptimizedImage
        {...defaultProps}
        placeholder="blur"
        blurDataURL={blurDataURL}
      />,
    );

    const image = screen.getByTestId("optimized-image");
    expect(image).toHaveAttribute("data-placeholder", "blur");
    expect(image).toHaveAttribute("data-blur-data-url", blurDataURL);
  });
});

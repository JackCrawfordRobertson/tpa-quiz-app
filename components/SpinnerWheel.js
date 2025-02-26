'use client';

import React from 'react';
import './wheel.css';
import Arrow from '../public/arrow1.svg';
import Ellipse from '../public/Ellipse1.svg';
import { quizSegments } from '../data/questions';
import { arrowStyles, leftEllipseStyles, rightEllipseStyles } from '../components/Wheel/styles';

// Predefined question order (set the order you want here)
const questionOrder = [1, 4, 3, 5, 2];

class SpinnerWheel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedItem: null,
      isSpinning: false,
      boxCenterPoint: {},
      currentQuestionIndex: 0, // Start at the first question in the order
      spinMultipliers: [4.5, 2.8, 3.4, 2.4, 3.6], // Spins per click
      currentSpinMultiplierIndex: 0, // Keeps track of which multiplier to use
      accumulatedSpinAngle: 0, // Track the total spin angle across spins
    };
    this.boxRef = React.createRef();
  }

  componentDidMount() {
    if (this.boxRef.current) {
      const boxPosition = this.boxRef.current.getBoundingClientRect();
      this.setState({
        boxCenterPoint: {
          x: boxPosition.left + boxPosition.width / 2,
          y: boxPosition.top + boxPosition.height / 2,
        },
      });

      window.addEventListener('mouseup', this.mouseUpHandler);
      window.addEventListener('mousemove', this.mouseMoveHandler);
    }
  }

  componentWillUnmount() {
    window.removeEventListener('mouseup', this.mouseUpHandler);
    window.removeEventListener('mousemove', this.mouseMoveHandler);
  }

  spinWheel = () => {
    if (this.state.isSpinning || !quizSegments.length) return;

    this.setState({ isSpinning: true });

    // Get the next question index based on the predefined order
    const nextQuestionIndex = questionOrder[this.state.currentQuestionIndex] - 1; // Convert to zero-based index
    const selectedItem = quizSegments[nextQuestionIndex];

    // Retrieve the spin multiplier for this click
    const multiplier = this.state.spinMultipliers[this.state.currentSpinMultiplierIndex];
    const fullSpinAngle = 360 * multiplier; // Calculate total spins based on multiplier

    const questionAngle = nextQuestionIndex * (360 / quizSegments.length); // Angle to land on the next question
    const totalSpinAngle = fullSpinAngle + questionAngle; // Total angle for the spin

    const newAccumulatedSpinAngle = this.state.accumulatedSpinAngle + totalSpinAngle;

    this.boxRef.current.style.transition = 'transform 3s ease-out';
    this.boxRef.current.style.transform = `rotate(${newAccumulatedSpinAngle}deg)`; // Apply the accumulated spin angle

    setTimeout(() => {
      this.setState({
        selectedItem,
        isSpinning: false,
        accumulatedSpinAngle: newAccumulatedSpinAngle, // Update accumulated angle
        currentQuestionIndex: (this.state.currentQuestionIndex + 1) % questionOrder.length, // Cycle through question order
        currentSpinMultiplierIndex: (this.state.currentSpinMultiplierIndex + 1) % this.state.spinMultipliers.length, // Change spin multiplier for next spin
      });

      if (this.props.onSpinEnd) {
        this.props.onSpinEnd(selectedItem);
      }
    }, 3000); // Wait for 3 seconds for the spin to complete
  };

  renderWheelItems = () => {
    return quizSegments.map((_, index) => (
      <div
        className="wheel-item"
        key={index}
        style={{ transform: `rotate(${index * (360 / quizSegments.length)}deg)` }}
      >
        Question {index + 1}
        <img src={Ellipse.src} alt="Ellipse" style={rightEllipseStyles} />
        <img src={Ellipse.src} alt="Ellipse" style={leftEllipseStyles} />
      </div>
    ));
  };

  render() {
    return (
      <div className="relative flex flex-col items-center justify-center">
        {/* Static Arrow Indicator */}
        <img src={Arrow.src} alt="Arrow" style={arrowStyles} />

        {/* Wheel */}
        <div className="wheel-container" ref={this.boxRef}>
          <div className="wheel">{this.renderWheelItems()}</div>
        </div>

        {/* Spin Button */}
        <button
          className="mt-6 p-3 bg-destructive text-white rounded hover:bg-destructive-foreground transition"
          onClick={this.spinWheel}
          disabled={this.state.isSpinning}
        >
          {this.state.isSpinning ? 'Spinning...' : 'Spin The Wheel'}
        </button>
      </div>
    );
  }
}

export default SpinnerWheel;
// src/pages/[restaurantUsername]/dashboard/sales-analytics/completion-time/index.js

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import DashboardLayout from "@/components/DashboardLayout";
import { ManagerOnly } from "@/components/Protected";
import { Card, Button } from "react-bootstrap";
import {
  FiCheckCircle,
  FiClock,
  FiTrendingUp,
  FiAlertTriangle,
  FiTarget,
  FiActivity,
} from "react-icons/fi";

export default function CompletionTimeAnalysis() {
  const router = useRouter();
  const { restaurantUsername } = router.query;

  return (
    <DashboardLayout>
      <ManagerOnly>
        <div style={{ padding: "1rem" }}>
          <h1
            style={{
              color: "#FFF",
              marginBottom: "2rem",
              display: "flex",
              alignItems: "center",
              gap: "1rem",
            }}
          >
            <FiCheckCircle style={{ color: "#FF9800" }} />
            Order Completion Time Analytics
          </h1>

          {/* Coming Soon Card */}
          <Card
            style={{ backgroundColor: "#1E1E2F", border: "2px solid #FF9800", textAlign: "center" }}
          >
            <Card.Body style={{ padding: "4rem 2rem" }}>
              <div style={{ fontSize: "4rem", marginBottom: "2rem" }}>
                <FiClock style={{ color: "#FF9800" }} />
              </div>

              <h2 style={{ color: "#FFF", marginBottom: "1rem" }}>Coming Soon!</h2>

              <p
                style={{
                  color: "#CCC",
                  fontSize: "1.1rem",
                  marginBottom: "2rem",
                  maxWidth: "600px",
                  margin: "0 auto 2rem",
                }}
              >
                Order Completion Time Analytics will provide comprehensive insights into your
                kitchen efficiency, order processing speed, and service optimization opportunities.
              </p>

              {/* Feature Preview */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "1.5rem",
                  marginBottom: "2rem",
                  textAlign: "left",
                }}
              >
                <div
                  style={{
                    backgroundColor: "#252538",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <div style={{ color: "#4CAF50", fontSize: "1.5rem", marginBottom: "1rem" }}>
                    <FiTarget />
                  </div>
                  <h5 style={{ color: "#FFF", marginBottom: "0.5rem" }}>Average Completion Time</h5>
                  <p style={{ color: "#CCC", fontSize: "0.9rem", margin: 0 }}>
                    Track average order processing time from placement to completion
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#252538",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <div style={{ color: "#2196F3", fontSize: "1.5rem", marginBottom: "1rem" }}>
                    <FiTrendingUp />
                  </div>
                  <h5 style={{ color: "#FFF", marginBottom: "0.5rem" }}>Performance Trends</h5>
                  <p style={{ color: "#CCC", fontSize: "0.9rem", margin: 0 }}>
                    Monitor completion time trends across different time periods
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#252538",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <div style={{ color: "#FF4444", fontSize: "1.5rem", marginBottom: "1rem" }}>
                    <FiAlertTriangle />
                  </div>
                  <h5 style={{ color: "#FFF", marginBottom: "0.5rem" }}>Bottleneck Detection</h5>
                  <p style={{ color: "#CCC", fontSize: "0.9rem", margin: 0 }}>
                    Identify process bottlenecks and optimization opportunities
                  </p>
                </div>

                <div
                  style={{
                    backgroundColor: "#252538",
                    padding: "1.5rem",
                    borderRadius: "8px",
                    border: "1px solid #3A3A4A",
                  }}
                >
                  <div style={{ color: "#9C27B0", fontSize: "1.5rem", marginBottom: "1rem" }}>
                    <FiActivity />
                  </div>
                  <h5 style={{ color: "#FFF", marginBottom: "0.5rem" }}>Kitchen Efficiency</h5>
                  <p style={{ color: "#CCC", fontSize: "0.9rem", margin: 0 }}>
                    Analyze kitchen performance and staff efficiency metrics
                  </p>
                </div>
              </div>

              <Button
                onClick={() => router.push(`/${restaurantUsername}/dashboard/sales-analytics`)}
                style={{
                  backgroundColor: "#FF9800",
                  borderColor: "#FF9800",
                  padding: "0.75rem 2rem",
                  fontSize: "1.1rem",
                  fontWeight: 600,
                }}
              >
                Back to Analytics Dashboard
              </Button>
            </Card.Body>
          </Card>
        </div>
      </ManagerOnly>
    </DashboardLayout>
  );
}

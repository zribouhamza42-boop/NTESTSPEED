import React, { useRef, useEffect, useState } from "react";
import * as d3 from "d3";
import { Language } from "../types";
import { motion, AnimatePresence } from "motion/react";

export interface ChartDataPoint {
  elapsed: number; // time in seconds (e.g., 0 to 6)
  value: number;   // Mbps
  type: "download" | "upload";
}

interface SpeedChartProps {
  data: ChartDataPoint[];
  activeStage: "idle" | "ping" | "download" | "upload" | "completed";
  language: Language;
}

export default function SpeedChart({ data, activeStage, language }: SpeedChartProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 260 });
  const isAr = language === "ar";
  const [theme, setTheme] = useState<"professional" | "cyberpunk">("professional");
  const isCyber = theme === "cyberpunk";

  const dlColor = isCyber ? "#ff007f" : "#3b82f6";
  const ulColor = isCyber ? "#00f5ff" : "#818cf8";

  // Use ResizeObserver to measure the container's active width and height in a debounced or fluid way
  useEffect(() => {
    if (!containerRef.current) return;

    const resizeObserver = new ResizeObserver((entries) => {
      if (!entries || entries.length === 0) return;
      const { width } = entries[0].contentRect;
      // We set height dynamically as well or keep it comfortable around 260px-300px
      const calculatedHeight = window.innerWidth < 640 ? 220 : 280;
      setDimensions({ width, height: calculatedHeight });
    });

    resizeObserver.observe(containerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  const handleResetZoom = () => {
    if (!svgRef.current || dimensions.width <= 0) return;
    const svg = d3.select<SVGSVGElement, unknown>(svgRef.current);
    
    const { width, height } = dimensions;
    const margin = { top: 25, right: 25, bottom: 45, left: 55 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 15])
      .extent([[0, 0], [innerWidth, innerHeight]])
      .translateExtent([[0, 0], [innerWidth, innerHeight]]);

    svg.transition()
      .duration(500)
      .ease(d3.easeCubicOut)
      .call(zoom.transform, d3.zoomIdentity);
  };

  useEffect(() => {
    if (!svgRef.current || dimensions.width <= 0) return;

    const svg = d3.select(svgRef.current);
    // Clear out everything from previous draws
    svg.selectAll("*").remove();

    const { width, height } = dimensions;
    const margin = { top: 25, right: 25, bottom: 45, left: 55 };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Define main SVG containers
    const chartGroup = svg
      .append("g")
      .attr("transform", `translate(${margin.left}, ${margin.top})`);

    // Extract data sets
    const downloadData = data.filter((d) => d.type === "download");
    const uploadData = data.filter((d) => d.type === "upload");

    // Compute range scales
    // X axis goes from 0s to 6s (3s download, 3s upload), scale out dynamically for safety
    const maxTime = d3.max(data, (d) => d.elapsed) || 6.0;
    const xMax = Math.max(6.0, maxTime);
    const xScale = d3.scaleLinear().domain([0, xMax]).range([0, innerWidth]);

    // Y axis is throughput (Mbps), ensure a baseline and some overhead padding
    const maxVal = d3.max(data, (d) => d.value) || 0;
    const yMax = Math.max(100, maxVal * 1.15);
    const yScale = d3.scaleLinear().domain([0, yMax]).range([innerHeight, 0]);

    // Retrieve active zoom transform from SVG or default to identity
    const currentTransform = d3.zoomTransform(svgRef.current);
    const zoomedXScale = currentTransform.rescaleX(xScale);

    // Add glowing filter definitions for neon aesthetics
    const defs = svg.append("defs");
    
    // Add Clip Path structure so zoomed graphs stay inside margins
    const clipId = "chart-clip-area";
    defs.append("clipPath")
      .attr("id", clipId)
      .append("rect")
      .attr("width", innerWidth)
      .attr("height", innerHeight);

    // Create clipped group for zoomable layers
    const clippedGroup = chartGroup
      .append("g")
      .attr("clip-path", `url(#${clipId})`);

    // Download glow
    const downloadFilter = defs.append("filter").attr("id", "dl-glow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
    downloadFilter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    downloadFilter.append("feMerge").append((_d) => {
      const m1 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
      m1.setAttribute("in", "blur");
      return m1;
    });
    downloadFilter.select("feMerge").append((_d) => {
      const m2 = document.createElementNS("http://www.w3.org/2000/svg", "feMergeNode");
      m2.setAttribute("in", "SourceGraphic");
      return m2;
    });

    // Upload glow
    const uploadFilter = defs.append("filter").attr("id", "ul-glow").attr("x", "-20%").attr("y", "-20%").attr("width", "140%").attr("height", "140%");
    uploadFilter.append("feGaussianBlur").attr("stdDeviation", "3").attr("result", "blur");
    const m = uploadFilter.append("feMerge");
    m.append("feMergeNode").attr("in", "blur");
    m.append("feMergeNode").attr("in", "SourceGraphic");

    // Background Gradient for Download
    const dlGrad = defs
      .append("linearGradient")
      .attr("id", "dl-grad")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    dlGrad.append("stop").attr("offset", "0%").attr("stop-color", dlColor).attr("stop-opacity", "0.25");
    dlGrad.append("stop").attr("offset", "100%").attr("stop-color", dlColor).attr("stop-opacity", "0.0");

    // Background Gradient for Upload
    const ulGrad = defs
      .append("linearGradient")
      .attr("id", "ul-grad")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");
    ulGrad.append("stop").attr("offset", "0%").attr("stop-color", ulColor).attr("stop-opacity", "0.25");
    ulGrad.append("stop").attr("offset", "100%").attr("stop-color", ulColor).attr("stop-opacity", "0.0");

    // Grid lines - horizontal
    chartGroup
      .append("g")
      .attr("class", "grid")
      .attr("color", "#1e293b")
      .style("opacity", "0.6")
      .call(
        d3
          .axisLeft(yScale)
          .tickSize(-innerWidth)
          .tickFormat(() => "")
      )
      .call((g) => g.select(".domain").remove());

    // Grid lines - vertical (as dynamic zoomable group)
    const vGridGroup = clippedGroup
      .append("g")
      .attr("class", "grid")
      .attr("color", "#1e293b")
      .style("opacity", "0.4")
      .attr("transform", `translate(0, ${innerHeight})`);

    vGridGroup.call(
      d3
        .axisBottom(zoomedXScale)
        .tickSize(-innerHeight)
        .tickFormat(() => "")
    ).call((g) => g.select(".domain").remove());

    // Custom Styled X Axis Group
    const xAxis = d3
      .axisBottom(zoomedXScale)
      .ticks(6)
      .tickFormat((d) => `${d}s`);

    const xAxisGroup = chartGroup
      .append("g")
      .attr("transform", `translate(0, ${innerHeight})`)
      .attr("color", "#475569")
      .style("font-family", "JetBrains Mono, SFMono-Regular, monospace")
      .style("font-size", "10px");

    xAxisGroup.call(xAxis)
      .call((g) => g.select(".domain").attr("stroke", "#334155"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#334155"));

    // Custom Styled Y Axis
    const yAxis = d3.axisLeft(yScale).ticks(5);

    chartGroup
      .append("g")
      .attr("color", "#475569")
      .style("font-family", "JetBrains Mono, SFMono-Regular, monospace")
      .style("font-size", "10px")
      .call(yAxis)
      .call((g) => g.select(".domain").attr("stroke", "#334155"))
      .call((g) => g.selectAll(".tick line").attr("stroke", "#334155"));

    // X-Axis Label
    chartGroup
      .append("text")
      .attr("x", innerWidth / 2)
      .attr("y", innerHeight + 35)
      .attr("fill", "#94a3b8")
      .attr("text-anchor", "middle")
      .style("font-family", "Inter, sans-serif")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .text(isAr ? "الزمن المنقضي (ثواني)" : "Elapsed Time (Seconds)");

    // Y-Axis Label
    chartGroup
      .append("text")
      .attr("transform", "rotate(-90)")
      .attr("x", -innerHeight / 2)
      .attr("y", -42)
      .attr("fill", "#94a3b8")
      .attr("text-anchor", "middle")
      .style("font-family", "Inter, sans-serif")
      .style("font-size", "11px")
      .style("font-weight", "500")
      .text(isAr ? "معدل التدفق (ميجابت/ث)" : "Throughput Rate (Mbps)");

    // D3 Line Generator
    const lineGenerator = d3
      .line<ChartDataPoint>()
      .x((d) => zoomedXScale(d.elapsed))
      .y((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    // D3 Area Generator
    const areaGenerator = d3
      .area<ChartDataPoint>()
      .x((d) => zoomedXScale(d.elapsed))
      .y0(innerHeight)
      .y1((d) => yScale(d.value))
      .curve(d3.curveMonotoneX);

    let dlAreaPath: any = null;
    let dlLinePath: any = null;

    // 1. Plot Download Data
    if (downloadData.length > 0) {
      // Area with pulse-bg class
      dlAreaPath = clippedGroup
        .append("path")
        .datum(downloadData)
        .attr("class", "pulse-bg-area")
        .attr("fill", "url(#dl-grad)")
        .attr("d", areaGenerator);

      // Line with flowing energy animation
      dlLinePath = clippedGroup
        .append("path")
        .datum(downloadData)
        .attr("class", "energy-line")
        .attr("fill", "none")
        .attr("stroke", dlColor)
        .attr("stroke-width", "3.5")
        .attr("stroke-linecap", "round")
        .attr("filter", "url(#dl-glow)")
        .attr("d", lineGenerator);

      // Latest Pinpoint Dot for download if in testing phase
      if (activeStage === "download") {
        const lastPt = downloadData[downloadData.length - 1];

        // Pulse ring 1 (Delayed)
        clippedGroup
          .append("circle")
          .datum(lastPt)
          .attr("class", "live-pinpoint live-pulse-ring-delayed")
          .attr("cx", zoomedXScale(lastPt.elapsed))
          .attr("cy", yScale(lastPt.value))
          .attr("r", "6")
          .attr("fill", "none")
          .attr("stroke", dlColor)
          .style("pointer-events", "none");

        // Pulse ring 2 (Active)
        clippedGroup
          .append("circle")
          .datum(lastPt)
          .attr("class", "live-pinpoint live-pulse-ring")
          .attr("cx", zoomedXScale(lastPt.elapsed))
          .attr("cy", yScale(lastPt.value))
          .attr("r", "6")
          .attr("fill", "none")
          .attr("stroke", dlColor)
          .style("pointer-events", "none");

        // Central solid core
        clippedGroup
          .append("circle")
          .datum(lastPt)
          .attr("class", "live-pinpoint")
          .attr("cx", zoomedXScale(lastPt.elapsed))
          .attr("cy", yScale(lastPt.value))
          .attr("r", "5.5")
          .attr("fill", dlColor)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", "1.5");
      }
    }

    let ulAreaPath: any = null;
    let ulLinePath: any = null;

    // 2. Plot Upload Data
    if (uploadData.length > 0) {
      // Area with dynamic pulse overlay
      ulAreaPath = clippedGroup
        .append("path")
        .datum(uploadData)
        .attr("class", "pulse-bg-area")
        .attr("fill", "url(#ul-grad)")
        .attr("d", areaGenerator);

      // Line with flowing cyberpunk style
      ulLinePath = clippedGroup
        .append("path")
        .datum(uploadData)
        .attr("class", "energy-line-upload")
        .attr("fill", "none")
        .attr("stroke", ulColor)
        .attr("stroke-width", "3.5")
        .attr("stroke-linecap", "round")
        .attr("filter", "url(#ul-glow)")
        .attr("d", lineGenerator);

      // Latest Pinpoint Dot for upload if in testing phase
      if (activeStage === "upload") {
        const lastPt = uploadData[uploadData.length - 1];

        // Pulse ring 1 (Delayed)
        clippedGroup
          .append("circle")
          .datum(lastPt)
          .attr("class", "live-pinpoint live-pulse-ring-delayed")
          .attr("cx", zoomedXScale(lastPt.elapsed))
          .attr("cy", yScale(lastPt.value))
          .attr("r", "6")
          .attr("fill", "none")
          .attr("stroke", ulColor)
          .style("pointer-events", "none");

        // Pulse ring 2 (Active)
        clippedGroup
          .append("circle")
          .datum(lastPt)
          .attr("class", "live-pinpoint live-pulse-ring")
          .attr("cx", zoomedXScale(lastPt.elapsed))
          .attr("cy", yScale(lastPt.value))
          .attr("r", "6")
          .attr("fill", "none")
          .attr("stroke", ulColor)
          .style("pointer-events", "none");

        // Central solid core
        clippedGroup
          .append("circle")
          .datum(lastPt)
          .attr("class", "live-pinpoint")
          .attr("cx", zoomedXScale(lastPt.elapsed))
          .attr("cy", yScale(lastPt.value))
          .attr("r", "5.5")
          .attr("fill", ulColor)
          .attr("stroke", "#ffffff")
          .attr("stroke-width", "1.5");
      }
    }

    // Configure zoom and panning behaviour (Zoom primarily works on visual X axis scale)
    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([1, 15])
      .extent([[0, 0], [innerWidth, innerHeight]])
      .translateExtent([[0, 0], [innerWidth, innerHeight]])
      .on("zoom", (event) => {
        const t = event.transform;
        const currentXScale = t.rescaleX(xScale);

        // Update X-axis DOM elements dynamically
        xAxisGroup.call(xAxis.scale(currentXScale));

        // Update grid vertical lines
        vGridGroup.call(
          d3.axisBottom(currentXScale)
            .tickSize(-innerHeight)
            .tickFormat(() => "")
        ).call((g) => g.select(".domain").remove());

        // Update paths on the fly without heavy React ticks
        if (dlLinePath) {
          dlLinePath.attr("d", lineGenerator.x((d) => currentXScale(d.elapsed)));
        }
        if (dlAreaPath) {
          dlAreaPath.attr("d", areaGenerator.x((d) => currentXScale(d.elapsed)));
        }
        if (ulLinePath) {
          ulLinePath.attr("d", lineGenerator.x((d) => currentXScale(d.elapsed)));
        }
        if (ulAreaPath) {
          ulAreaPath.attr("d", areaGenerator.x((d) => currentXScale(d.elapsed)));
        }

        // Move live pins
        clippedGroup.selectAll(".live-pinpoint").attr("cx", (d) => currentXScale((d as ChartDataPoint).elapsed));
      });

    // Attach zoom listeners
    svg.call(zoom);

    // Disable double-click zoom
    svg.on("dblclick.zoom", null);

  }, [data, dimensions, activeStage, isAr, theme, dlColor, ulColor]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="w-full flex flex-col" 
      id="throughput-d3-chart-container" 
      ref={containerRef}
    >
      {/* Custom styles for real-time line streams and radar rings */}
      <style>{`
        @keyframes dl-energy-flow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -30;
          }
        }
        .energy-line {
          stroke-dasharray: 12, 6;
          animation: dl-energy-flow 1.2s linear infinite;
        }

        @keyframes ul-energy-flow {
          0% {
            stroke-dashoffset: 0;
          }
          100% {
            stroke-dashoffset: -30;
          }
        }
        .energy-line-upload {
          stroke-dasharray: 12, 6;
          animation: ul-energy-flow 1.2s linear infinite;
        }

        @keyframes live-pulse-wave {
          0% {
            r: 5.5px;
            stroke-opacity: 0.95;
            stroke-width: 2.5px;
          }
          50% {
            stroke-opacity: 0.6;
            stroke-width: 1.5px;
          }
          100% {
            r: 28px;
            stroke-opacity: 0;
            stroke-width: 0.5px;
          }
        }
        .live-pulse-ring {
          animation: live-pulse-wave 1.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }
        .live-pulse-ring-delayed {
          animation: live-pulse-wave 1.5s cubic-bezier(0.16, 1, 0.3, 1) infinite;
          animation-delay: 0.75s;
        }

        @keyframes bg-glow-pulse {
          0%, 100% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.35;
          }
        }
        .pulse-bg-area {
          animation: bg-glow-pulse 4s ease-in-out infinite;
        }
      `}</style>

      {/* Chart Legend & Context Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 px-1 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full animate-pulse transition-colors" style={{ backgroundColor: dlColor }}></span>
          <span className="font-mono text-slate-200 font-bold uppercase tracking-wider">
            {isAr ? "تحليل التدفق بالزمن الحقيقي" : "Throughput Spectral Feed"}
          </span>
          {data.length > 0 && (
            <span className="text-[10px] text-slate-400 font-semibold px-2 py-0.5 rounded-full bg-slate-900 border border-slate-800">
              {isAr ? "💡 مرر للتكبير • اسحب للتحريك" : "💡 Scroll to zoom • Drag to pan"}
            </span>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[11px] font-mono select-none">
          {/* Cyberpunk vs Professional Theme Segmented Control */}
          <div className="flex items-center bg-slate-900 rounded-lg p-0.5 border border-slate-800" id="chart-theme-toggle">
            <button
              onClick={() => setTheme("professional")}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                theme === "professional"
                  ? "bg-slate-800 text-blue-400 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isAr ? "احترافي" : "Professional"}
            </button>
            <button
              onClick={() => setTheme("cyberpunk")}
              className={`px-2 py-1 rounded text-[10px] font-bold transition-all cursor-pointer ${
                theme === "cyberpunk"
                  ? "bg-slate-800 text-pink-500 shadow-sm"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              {isAr ? "سايبربانك" : "Cyberpunk"}
            </button>
          </div>

          {data.length > 0 && (
            <button
              onClick={handleResetZoom}
              className="mr-2 px-2.5 py-1 rounded bg-slate-900 hover:bg-slate-800 border border-slate-800 hover:border-blue-500/30 text-[10px] text-blue-400 font-bold transition-all shadow-sm cursor-pointer hover:shadow-[0_0_10px_rgba(59,130,246,0.15)] active:scale-95"
              title={isAr ? "إعادة تعيين مقياس التكبير" : "Reset scale level to original"}
            >
              {isAr ? "🔍 إعادة تعيين" : "🔍 Reset Zoom"}
            </button>
          )}
          
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <span className="w-3 h-1 rounded-sm inline-block transition-colors" style={{ backgroundColor: dlColor }}></span>
            <span className="text-slate-400 font-semibold">{isAr ? "التحميل" : "Download"}</span>
          </div>
          <div className="flex items-center space-x-1.5 rtl:space-x-reverse">
            <span className="w-3 h-1 rounded-sm inline-block transition-colors" style={{ backgroundColor: ulColor }}></span>
            <span className="text-slate-400 font-semibold">{isAr ? "الرفع" : "Upload"}</span>
          </div>
        </div>
      </div>

      {/* Main SVG Container */}
      <div className="bg-slate-950/70 border border-slate-900 rounded-xl overflow-hidden p-1 shadow-inner relative cursor-crosshair">
        <svg
          ref={svgRef}
          width={dimensions.width}
          height={dimensions.height}
          className="overflow-visible block"
          style={{ maxWidth: "100%" }}
        ></svg>

        {/* Empty State Overlay */}
        <AnimatePresence>
          {data.length === 0 && (
            <motion.div 
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.4 }}
              className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 bg-slate-950/80 backdrop-blur-sm z-20"
            >
              <span className="w-8 h-8 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600 mb-2 font-black">
                📊
              </span>
              <p className="text-xs text-slate-400 font-bold">
                {isAr ? "مقياس تدفق البيانات شاغر حالياً" : "Throughput line chart ready"}
              </p>
              <p className="text-[10px] text-slate-500 mt-1">
                {isAr ? "ابدأ الفحص لمشاهدة الانحناءات البيانية بالزمن الحقيقي" : "Start the speed test to stream dynamic wave data"}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}

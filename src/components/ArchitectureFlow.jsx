import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Server,
  Layers,
  Database,
  Lock,
  CheckCircle2,
  AlertCircle,
  Play,
  RotateCcw,
  Zap,
  Activity,
  Cpu,
  Smartphone,
  CreditCard,
  Train,
  Mail,
  RefreshCw,
  Binary,
  GitBranch,
  Network,
  ArrowRight,
  ArrowDown,
  Info,
  Sliders,
  Radio,
  ExternalLink,
} from 'lucide-react'

const TOPOLOGY_NODES = {
  client: {
    id: 'client',
    title: 'Frontend Client',
    type: 'Client Layer',
    tech: 'Next.js 14 · React · Tailwind CSS',
    port: '3000',
    desc: 'Responsive web interface for train search, interactive seat selection, wallet transactions, and real-time PNR tracking.',
    details: [
      'JWT Auth Interceptors & Local Storage token refresh',
      'Dynamic station search with auto-suggest',
      'Interactive seat map with bitmask availability indicators',
      'Wallet top-up, direct booking, and instant cancellation',
    ],
  },
  gateway: {
    id: 'gateway',
    title: 'Spring Cloud API Gateway',
    type: 'Edge & Security Layer',
    tech: 'Spring Cloud Gateway · WebFlux',
    port: '8080',
    desc: 'Single entry point for all client requests with centralized security, routing, and load balancing.',
    details: [
      'Custom JWT Authentication WebFilter',
      'Eureka-driven dynamic route discovery (lb://service-name)',
      'Global CORS configuration & route-level rate limiting',
      'Centralized error transformation & request correlation IDs',
    ],
  },
  eureka: {
    id: 'eureka',
    title: 'Netflix Eureka Registry',
    type: 'Service Discovery',
    tech: 'Spring Cloud Netflix Eureka',
    port: '8761',
    desc: 'Maintains live registry of all microservices instances with heartbeat health monitoring.',
    details: [
      'Decentralized service discovery without hardcoded IPs',
      'Client-side load balancing via OpenFeign & Spring Cloud',
      'Self-preservation mode during network partitions',
      'Real-time instance status dashboard',
    ],
  },
  booking: {
    id: 'booking',
    title: 'Booking Service',
    type: 'Core Business Service',
    tech: 'Spring Boot 3 · Spring Data JPA · OpenFeign',
    port: '8083',
    desc: 'Saga orchestrator for ticket lifecycles, 10-digit unique PNR generation, and compensation rollbacks.',
    details: [
      'Orchestrates: SeatLock → Wallet Deduct → SeatConfirm',
      'Generates collision-free 10-digit PNR with retry threshold',
      'Automatic Saga compensation rollback on payment/feign failures',
      'Manages Booking and BookingPassenger relational graphs',
    ],
  },
  seat: {
    id: 'seat',
    title: 'Seat Service (Bitmask Engine)',
    type: 'Core Business Service',
    tech: 'Spring Boot 3 · Bitwise Segment Math · JPA',
    port: '8084',
    desc: 'Revolutionary bitmask station segment seat allocation, pessimistic locking, and automated waitlist cascades.',
    details: [
      'Bitmask formula: ((1L << (to - from)) - 1) << (from - 1)',
      'Enables non-overlapping stop sharing on the same physical seat',
      'Pessimistic seat locking with automatic TTL expiry',
      'Auto-promotes WL-1 passengers on ticket cancellation',
    ],
  },
  wallet: {
    id: 'wallet',
    title: 'Wallet Service',
    type: 'Financial & Ledger Service',
    tech: 'Spring Boot 3 · Atomic SQL · Transactions',
    port: '8087',
    desc: 'Atomic user balance management, transaction ledger tracking, and instant automated refunds.',
    details: [
      'Row-level locking during debit/credit operations',
      'Immutable audit trail for all DEBIT, CREDIT, and REFUND events',
      'Prevents double-spending with ACID transaction isolation',
      'Instant refund dispatch on ticket cancellation',
    ],
  },
  train: {
    id: 'train',
    title: 'Train Service',
    type: 'Domain Service',
    tech: 'Spring Boot 3 · Dynamic Routing',
    port: '8082',
    desc: 'Train schedules, station stop numbers, distances, intermediate halts, and dynamic fare computation.',
    details: [
      'Computes stop numbers and day-offsets for multi-day routes',
      'Fare calculation per coach class (SL, 3A, 2A, 1A)',
      'Station graph indexing for rapid route queries',
    ],
  },
  auth: {
    id: 'auth',
    title: 'Auth & User Service',
    type: 'Identity & Profile Layer',
    tech: 'Spring Security · JWT · Spring Data',
    port: '8081 / 8085',
    desc: 'User registration, encrypted credentials, JWT access & refresh tokens, and passenger master management.',
    details: [
      'Stateless JWT signing with secret key rotation',
      'Saved passenger master lists for rapid Tatkal booking',
      'Kafka producer integration for verification & alerts',
    ],
  },
  kafka: {
    id: 'kafka',
    title: 'Apache Kafka & Notifications',
    type: 'Event Streaming Tier',
    tech: 'Apache Kafka · Spring Kafka',
    port: '9092 / 8086',
    desc: 'Decoupled asynchronous event broker for transactional emails, SMS notifications, and booking alerts.',
    details: [
      'Topic: "email-topic" with partitioned event streaming',
      'Asynchronous notification dispatch without blocking HTTP threads',
      'Resilient consumer retry policy with Dead Letter Queues',
    ],
  },
  redis: {
    id: 'redis',
    title: 'Redis Cache & Locks',
    type: 'In-Memory Data Tier',
    tech: 'Redis In-Memory · Lettuce Client',
    port: '6379',
    desc: 'High-speed caching for train schedules, bitmask seat matrices, and distributed concurrency protection.',
    details: [
      'Sub-millisecond train seat availability lookups',
      'Distributed session caching and rate limiter token buckets',
      'TTL-based eviction for volatile reservation states',
    ],
  },
  database: {
    id: 'database',
    title: 'PostgreSQL Microservice Databases',
    type: 'ACID Persistence Tier',
    tech: 'PostgreSQL 15 · Database-per-Service',
    port: '5432',
    desc: 'Dedicated isolated databases for each service adhering to the Database-per-Service microservice pattern.',
    details: [
      'booking_db: bookings, booking_passengers, pnr_index',
      'seat_db: seat_master, seat_inventory, confirmed_seats, waitlist_entry',
      'wallet_db: wallets, wallet_transactions',
      'train_db & auth_db: trains, stations, users, refresh_tokens',
    ],
  },
}

const FLOWS = [
  {
    id: 'booking-saga',
    title: '1. Booking Saga (Happy Path)',
    badge: 'Distributed Saga',
    desc: 'End-to-end ticket reservation orchestrating Booking, Seat (Bitmask lock), and Wallet services with PNR generation.',
  },
  {
    id: 'bitmask-reuse',
    title: '2. Bitmask Station Segment Sharing',
    badge: 'Bitwise Concurrency',
    desc: 'Demonstrates how two passengers share the same physical seat for non-overlapping station stop segments.',
  },
  {
    id: 'cancellation-waitlist',
    title: '3. Cancellation & Auto-Waitlist Upgrade',
    badge: 'Event Cascade',
    desc: 'Seat cancellation triggers automatic bitmask release, instant wallet refund, and auto-allotment for WL-1 passenger.',
  },
  {
    id: 'saga-rollback',
    title: '4. Saga Compensation (Payment Failure)',
    badge: 'Fault Tolerance',
    desc: 'When wallet deduction fails, Booking Service catches FeignException and triggers compensation to release locked seats.',
  },
]

const SIM_SERVICES = [
  { id: 'client', name: 'Frontend Client', sub: 'Next.js / React', icon: Smartphone, color: '#56ccf2' },
  { id: 'gateway', name: 'API Gateway', sub: 'Spring Cloud / :8080', icon: ShieldCheck, color: '#7c83fd' },
  { id: 'booking', name: 'Booking Service', sub: 'Saga Orchestrator', icon: Layers, color: '#b47cff' },
  { id: 'seat', name: 'Seat Service', sub: 'Bitmask Engine', icon: Binary, color: '#00ff88' },
  { id: 'wallet', name: 'Wallet Service', sub: 'Atomic Ledger', icon: CreditCard, color: '#ffb347' },
  { id: 'train', name: 'Train Service', sub: 'Route & Fare Engine', icon: Train, color: '#ff7ee5' },
  { id: 'kafka', name: 'Kafka & Notification', sub: 'topic: email-topic', icon: Mail, color: '#4facfe' },
]

export default function ArchitectureFlow() {
  const [activeTab, setActiveTab] = useState('topology') // 'topology' | 'simulator'
  const [selectedNode, setSelectedNode] = useState(TOPOLOGY_NODES.gateway)
  
  // Simulator State
  const [selectedFlow, setSelectedFlow] = useState('booking-saga')
  const [activeServiceIdx, setActiveServiceIdx] = useState(-1)
  const [isRunning, setIsRunning] = useState(false)
  const [logs, setLogs] = useState([])
  const [simulationResult, setSimulationResult] = useState(null)
  const [bitmaskState, setBitmaskState] = useState(null)
  const logContainerRef = useRef(null)

  useEffect(() => {
    resetSimulation()
  }, [selectedFlow])

  useEffect(() => {
    logContainerRef.current?.scrollTo({
      top: logContainerRef.current.scrollHeight,
      behavior: 'smooth',
    })
  }, [logs])

  const addLog = (service, message, type = 'info') => {
    const time = new Date().toLocaleTimeString('en-US', {
      hour12: false,
      minute: '2-digit',
      second: '2-digit',
      fractionalSecondDigits: 2,
    })
    setLogs((prev) => [...prev, { time, service, message, type }])
  }

  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

  const resetSimulation = () => {
    setActiveServiceIdx(-1)
    setIsRunning(false)
    setSimulationResult(null)
    setBitmaskState(null)
    setLogs([
      {
        time: '00:00.00',
        service: 'System',
        message: `Selected flow: "${FLOWS.find((f) => f.id === selectedFlow)?.title}". Click "Run Simulation" to execute.`,
        type: 'info',
      },
    ])
  }

  const runSimulation = async () => {
    if (isRunning) return
    setIsRunning(true)
    setSimulationResult(null)
    setLogs([])

    const pnr = `PNR-${Math.floor(1000000000 + Math.random() * 9000000000)}`

    if (selectedFlow === 'booking-saga') {
      setActiveServiceIdx(0)
      addLog('Client', 'User clicked "Confirm Reservation" → POST /api/v1/booking/create (Train #12728, HYB → VSKP)', 'info')
      await sleep(650)

      setActiveServiceIdx(1)
      addLog('API Gateway', 'Validated JWT token. Eureka resolved route lb://booking-service', 'info')
      await sleep(650)

      setActiveServiceIdx(2)
      addLog('BookingService', `Initialized Booking [ID: bk_9120, PNR: ${pnr}] with status PENDING`, 'info')
      addLog('BookingService', 'Dispatched Feign RPC: seatServiceClient.lockSeats()', 'info')
      await sleep(750)

      setActiveServiceIdx(3)
      addLog('SeatService', 'Calculated requestedMask = ((1L << (to - from)) - 1) << (from - 1) → 0b00001111', 'info')
      addLog('SeatService', 'Executed findAndLockAvailableSeats() with pessimistic write lock. Locked Coach S2, Seat 21', 'success')
      addLog('SeatService', 'Saved SeatLock record (TTL 300s). Returned SeatLockResponse with Fare: ₹640.00', 'info')
      await sleep(850)

      setActiveServiceIdx(4)
      addLog('BookingService', 'Dispatched Feign RPC: walletServiceClient.deduct(userId, ₹640.00)', 'info')
      addLog('WalletService', 'Acquired row lock on wallet. Deducted ₹640.00. Saved Debit Transaction ID: txn_8192', 'success')
      await sleep(750)

      setActiveServiceIdx(3)
      addLog('BookingService', 'Dispatched Feign RPC: seatServiceClient.confirmSeats(bookingId)', 'info')
      addLog('SeatService', 'Bitwise committed: seat.confirmSeat(mask). Persisted ConfirmedSeat record for Coach S2, Seat 21', 'success')
      await sleep(700)

      setActiveServiceIdx(2)
      addLog('BookingService', `Booking status transitioned to CONFIRMED! Total Fare: ₹640.00`, 'success')
      await sleep(400)

      setActiveServiceIdx(6)
      addLog('AuthService', 'KafkaTemplate sent EmailEvent to topic "email-topic"', 'info')
      addLog('NotificationService', `Kafka Consumer received EmailEvent. Sent PNR ${pnr} booking confirmation email & SMS!`, 'success')

      setSimulationResult({
        title: 'RESERVATION SAGA COMPLETED',
        details: `${pnr} · Coach S2, Seat 21 (Window) · ₹640.00 Confirmed`,
        type: 'success',
      })
    } else if (selectedFlow === 'bitmask-reuse') {
      setActiveServiceIdx(0)
      addLog('Client', 'Passenger 1 requests: Stop 1 (Secunderabad) → Stop 3 (Kazipet) [2 Stops]', 'info')
      addLog('Client', 'Passenger 2 requests: Stop 3 (Kazipet) → Stop 6 (Visakhapatnam) [3 Stops]', 'info')
      await sleep(700)

      setActiveServiceIdx(3)
      addLog('SeatService', 'Passenger 1 Segment Mask: ((1L << 2) - 1) << 0 = 0b00000011 (Stops 1→3)', 'info')
      addLog('SeatService', 'Passenger 2 Segment Mask: ((1L << 3) - 1) << 2 = 0b00011100 (Stops 3→6)', 'info')
      await sleep(800)

      setBitmaskState({
        seatNumber: 'Coach B1, Seat 18',
        p1Mask: '00000011 (Stops 1-3)',
        p2Mask: '00011100 (Stops 3-6)',
        overlap: '0b00000011 & 0b00011100 = 0 (No Overlap!)',
      })

      addLog('SeatService', 'Bitwise collision check: (Mask1 & Mask2) == 0 → TRUE! No overlap detected!', 'success')
      addLog('SeatService', 'ALLOTED SAME PHYSICAL SEAT (Coach B1, Seat 18) to both passengers across different stop segments!', 'success')
      await sleep(700)

      setSimulationResult({
        title: 'BITMASK SEGMENT REUSE SUCCESSFUL',
        details: 'Seat B1-18 utilized 100% across the full train route with ZERO wasted seat-miles!',
        type: 'success',
      })
    } else if (selectedFlow === 'cancellation-waitlist') {
      setActiveServiceIdx(0)
      addLog('Client', 'Passenger A submitted Cancellation for PNR #4928172918', 'info')
      await sleep(600)

      setActiveServiceIdx(2)
      addLog('BookingService', 'Dispatched Feign RPC: seatServiceClient.cancelSeats()', 'info')
      await sleep(700)

      setActiveServiceIdx(3)
      addLog('SeatService', 'Cleared bitmask: seat.cancelSeat(mask). Flagged seat.setLockedForWaitlist(true)', 'info')
      addLog('SeatService', 'Triggered allotSeatToWaitlistedPassenger(seatInventoryId)', 'warn')
      addLog('SeatService', 'Found WaitlistEntry [ID: wl_1094, Position: WL-1] for matching coach & stop mask', 'info')
      addLog('SeatService', 'Promoted Passenger B from WL-1 → CONFIRMED (Coach S1, Seat 42)!', 'success')
      addLog('SeatService', 'Removed WaitlistEntry from waitlist_entry repository.', 'success')
      await sleep(800)

      setActiveServiceIdx(5)
      addLog('BookingService', 'Dispatched Feign RPC: trainServiceClient.getFare() to compute exact refund', 'info')
      await sleep(500)

      setActiveServiceIdx(4)
      addLog('BookingService', 'Dispatched Feign RPC: walletServiceClient.refund(userId, ₹520.00)', 'info')
      addLog('WalletService', 'Wallet credited with ₹520.00 refund. Balance updated atomically.', 'success')
      await sleep(600)

      setSimulationResult({
        title: 'CANCELLATION & WAITLIST CASCADE COMPLETE',
        details: 'Passenger A refunded ₹520.00 · Waitlist passenger WL-1 upgraded to CONFIRMED!',
        type: 'success',
      })
    } else if (selectedFlow === 'saga-rollback') {
      setActiveServiceIdx(0)
      addLog('Client', 'User requests booking for 4 passengers (Total Fare: ₹2,400.00)', 'info')
      await sleep(600)

      setActiveServiceIdx(2)
      addLog('BookingService', `Created Booking [ID: bk_9912] in PENDING state`, 'info')
      await sleep(600)

      setActiveServiceIdx(3)
      addLog('BookingService', 'Dispatched Feign RPC: seatServiceClient.lockSeats()', 'info')
      addLog('SeatService', 'Pessimistically locked 4 seats in Coach B2 (Seats 11, 12, 13, 14)', 'warn')
      await sleep(700)

      setActiveServiceIdx(4)
      addLog('BookingService', 'Dispatched Feign RPC: walletServiceClient.deduct(userId, ₹2,400.00)', 'info')
      addLog('WalletService', 'ERROR: User wallet balance is ₹850.00. Thrown: "Insufficient balance"', 'error')
      await sleep(800)

      setActiveServiceIdx(2)
      addLog('BookingService', 'Caught FeignException (Status 400). Initiating SAGA COMPENSATION ROLLBACK...', 'error')
      await sleep(600)

      setActiveServiceIdx(3)
      addLog('BookingService', 'Compensation Step 1: Dispatched seatServiceClient.releaseSeats(bookingId)', 'warn')
      addLog('SeatService', 'Released all 4 seat locks in Coach B2. Cleared bitmask locks and deleted seat_lock records.', 'success')
      await sleep(600)

      setActiveServiceIdx(2)
      addLog('BookingService', 'Compensation Step 2: Transitioned Booking status to FAILED. Database consistent.', 'success')

      setSimulationResult({
        title: 'SAGA COMPENSATION ROLLBACK SUCCESSFUL',
        details: 'Payment failed → All 4 locked seats released back to inventory. 0 orphaned locks!',
        type: 'error',
      })
    }

    setIsRunning(false)
  }

  return (
    <div className="arch-simulator">
      {/* Top Level Mode Switcher */}
      <div className="arch-mode-switcher">
        <button
          type="button"
          className={`arch-mode-btn ${activeTab === 'topology' ? 'active' : ''}`}
          onClick={() => setActiveTab('topology')}
        >
          <Network size={15} /> Full System Architecture Topology
        </button>
        <button
          type="button"
          className={`arch-mode-btn ${activeTab === 'simulator' ? 'active' : ''}`}
          onClick={() => setActiveTab('simulator')}
        >
          <Activity size={15} /> Interactive Flow Simulator (4 Scenarios)
        </button>
      </div>

      {/* ===================== TAB 1: FULL TOPOLOGY DIAGRAM ===================== */}
      {activeTab === 'topology' && (
        <div className="arch-topology-view">
          <div className="arch-header">
            <div className="arch-title-group">
              <div className="arch-badge">
                <Network size={13} className="arch-pulse-icon" />
                <span className="mono">End-to-End Microservices Blueprint</span>
              </div>
              <h4>Complete System Architecture & Infrastructure</h4>
              <p className="arch-subtitle">
                Click any component below to inspect its responsibilities, port bindings, and communication protocols across the mesh.
              </p>
            </div>
          </div>

          {/* Full Tier Architecture Diagram */}
          <div className="topology-diagram">
            {/* Tier 1: Client Tier */}
            <div className="topo-tier">
              <div className="topo-tier-header mono">TIER 1 · CLIENT APPLICATION</div>
              <div className="topo-tier-body">
                <div
                  className={`topo-node client-node ${selectedNode.id === 'client' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode(TOPOLOGY_NODES.client)}
                >
                  <Smartphone size={20} className="node-icon" />
                  <div>
                    <strong>Next.js 14 Client</strong>
                    <span className="mono">React UI / Port 3000</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="topo-connector-down">
              <span className="mono">HTTP / REST + JWT</span>
              <ArrowDown size={16} />
            </div>

            {/* Tier 2: Edge Gateway & Service Registry */}
            <div className="topo-tier">
              <div className="topo-tier-header mono">TIER 2 · EDGE GATEWAY & SERVICE DISCOVERY</div>
              <div className="topo-tier-body tier-split">
                <div
                  className={`topo-node gateway-node ${selectedNode.id === 'gateway' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode(TOPOLOGY_NODES.gateway)}
                >
                  <ShieldCheck size={20} className="node-icon" />
                  <div>
                    <strong>Spring Cloud API Gateway</strong>
                    <span className="mono">Port :8080 · JWT Auth Filter</span>
                  </div>
                </div>

                <div
                  className={`topo-node eureka-node ${selectedNode.id === 'eureka' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode(TOPOLOGY_NODES.eureka)}
                >
                  <Server size={20} className="node-icon" />
                  <div>
                    <strong>Netflix Eureka Registry</strong>
                    <span className="mono">Port :8761 · Dynamic Discovery</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="topo-connector-down">
              <span className="mono">Load-Balanced Dynamic Routes (lb://)</span>
              <ArrowDown size={16} />
            </div>

            {/* Tier 3: Microservices Mesh */}
            <div className="topo-tier mesh-tier">
              <div className="topo-tier-header mono">TIER 3 · CORE SPRING BOOT MICROSERVICES MESH (OPENFEIGN RPC)</div>
              <div className="topo-tier-body mesh-grid">
                <div
                  className={`topo-node ${selectedNode.id === 'booking' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode(TOPOLOGY_NODES.booking)}
                >
                  <Layers size={18} className="node-icon booking-c" />
                  <div>
                    <strong>Booking Service</strong>
                    <span className="mono">:8083 · Saga Orchestrator</span>
                  </div>
                </div>

                <div
                  className={`topo-node ${selectedNode.id === 'seat' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode(TOPOLOGY_NODES.seat)}
                >
                  <Binary size={18} className="node-icon seat-c" />
                  <div>
                    <strong>Seat Service</strong>
                    <span className="mono">:8084 · Bitmask Engine</span>
                  </div>
                </div>

                <div
                  className={`topo-node ${selectedNode.id === 'wallet' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode(TOPOLOGY_NODES.wallet)}
                >
                  <CreditCard size={18} className="node-icon wallet-c" />
                  <div>
                    <strong>Wallet Service</strong>
                    <span className="mono">:8087 · Atomic Ledger</span>
                  </div>
                </div>

                <div
                  className={`topo-node ${selectedNode.id === 'train' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode(TOPOLOGY_NODES.train)}
                >
                  <Train size={18} className="node-icon train-c" />
                  <div>
                    <strong>Train Service</strong>
                    <span className="mono">:8082 · Route & Fares</span>
                  </div>
                </div>

                <div
                  className={`topo-node ${selectedNode.id === 'auth' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode(TOPOLOGY_NODES.auth)}
                >
                  <ShieldCheck size={18} className="node-icon auth-c" />
                  <div>
                    <strong>Auth & User</strong>
                    <span className="mono">:8081 · JWT & Profiles</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="topo-connector-down">
              <span className="mono">Async Events & Distributed Persistence</span>
              <ArrowDown size={16} />
            </div>

            {/* Tier 4: Kafka, Redis & Persistence Layer */}
            <div className="topo-tier data-tier">
              <div className="topo-tier-header mono">TIER 4 & 5 · ASYNC STREAMING, IN-MEMORY CACHE & POSTGRESQL</div>
              <div className="topo-tier-body data-grid">
                <div
                  className={`topo-node kafka-node ${selectedNode.id === 'kafka' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode(TOPOLOGY_NODES.kafka)}
                >
                  <Mail size={18} className="node-icon" />
                  <div>
                    <strong>Apache Kafka</strong>
                    <span className="mono">email-topic & Notification</span>
                  </div>
                </div>

                <div
                  className={`topo-node redis-node ${selectedNode.id === 'redis' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode(TOPOLOGY_NODES.redis)}
                >
                  <Cpu size={18} className="node-icon" />
                  <div>
                    <strong>Redis Cache & Locks</strong>
                    <span className="mono">Port :6379 · In-Memory Matrix</span>
                  </div>
                </div>

                <div
                  className={`topo-node db-node ${selectedNode.id === 'database' ? 'selected' : ''}`}
                  onClick={() => setSelectedNode(TOPOLOGY_NODES.database)}
                >
                  <Database size={18} className="node-icon" />
                  <div>
                    <strong>PostgreSQL DBs</strong>
                    <span className="mono">Database-per-Service (Port :5432)</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Node Inspector Card */}
          <div className="topo-inspector">
            <div className="inspector-head">
              <div className="inspector-title-wrap">
                <span className="inspector-badge mono">{selectedNode.type}</span>
                <h4>{selectedNode.title}</h4>
              </div>
              <div className="inspector-meta mono">
                <span>Stack: {selectedNode.tech}</span>
                <span>Port: {selectedNode.port}</span>
              </div>
            </div>
            <p className="inspector-desc">{selectedNode.desc}</p>
            <div className="inspector-details">
              <strong className="mono">Key Architectural Responsibilities:</strong>
              <ul>
                {selectedNode.details.map((item, idx) => (
                  <li key={idx}>
                    <CheckCircle2 size={13} className="check-bullet" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}

      {/* ===================== TAB 2: INTERACTIVE FLOW SCENARIOS ===================== */}
      {activeTab === 'simulator' && (
        <div className="arch-simulator-view">
          {/* Flow Selector Tabs */}
          <div className="arch-flows-bar">
            <span className="arch-flows-title mono">Select Flow Scenario:</span>
            <div className="arch-flows-tabs">
              {FLOWS.map((flow) => (
                <button
                  key={flow.id}
                  type="button"
                  className={`arch-flow-tab ${selectedFlow === flow.id ? 'active' : ''}`}
                  onClick={() => {
                    if (!isRunning) setSelectedFlow(flow.id)
                  }}
                  disabled={isRunning}
                >
                  <span className="flow-tab-title">{flow.title}</span>
                  <span className="flow-tab-badge mono">{flow.badge}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Header & Controls */}
          <div className="arch-header">
            <div className="arch-title-group">
              <div className="arch-badge">
                <Activity size={13} className="arch-pulse-icon" />
                <span className="mono">Live Execution Trace</span>
              </div>
              <h4>{FLOWS.find((f) => f.id === selectedFlow)?.title}</h4>
              <p className="arch-subtitle">
                {FLOWS.find((f) => f.id === selectedFlow)?.desc}
              </p>
            </div>

            <div className="arch-controls">
              <button
                type="button"
                className={`arch-btn arch-btn-primary ${isRunning ? 'disabled' : ''}`}
                onClick={runSimulation}
                disabled={isRunning}
              >
                <Play size={14} /> Run Simulation
              </button>
              <button
                type="button"
                className="arch-btn arch-btn-ghost"
                onClick={resetSimulation}
                disabled={isRunning}
                title="Reset simulation"
              >
                <RotateCcw size={14} /> Reset
              </button>
            </div>
          </div>

          {/* Visual Service Mesh Nodes */}
          <div className="arch-mesh-grid">
            {SIM_SERVICES.map((svc, idx) => {
              const Icon = svc.icon
              const isActive = activeServiceIdx === idx

              return (
                <motion.div
                  key={svc.id}
                  className={`arch-svc-card ${isActive ? 'active' : ''}`}
                  style={{ '--svc-color': svc.color }}
                  animate={{
                    scale: isActive ? 1.04 : 1,
                    borderColor: isActive ? svc.color : 'rgba(255, 255, 255, 0.08)',
                  }}
                  transition={{ duration: 0.25 }}
                >
                  <div className="svc-glow" />
                  <div className="svc-icon-box">
                    <Icon size={18} className="svc-icon" />
                    {isActive && <span className="svc-live-dot" />}
                  </div>
                  <strong className="svc-name">{svc.name}</strong>
                  <span className="svc-sub mono">{svc.sub}</span>
                </motion.div>
              )
            })}
          </div>

          {/* Bitmask Explainer Card (for Flow 2) */}
          <AnimatePresence>
            {bitmaskState && (
              <motion.div
                className="arch-bitmask-card mono"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
              >
                <div className="bitmask-header">
                  <Binary size={16} className="bitmask-icon" />
                  <span>Bitmask Engine State ({bitmaskState.seatNumber})</span>
                </div>
                <div className="bitmask-grid">
                  <div>Passenger 1 (Secunderabad → Kazipet): <span className="code-hl">{bitmaskState.p1Mask}</span></div>
                  <div>Passenger 2 (Kazipet → Visakhapatnam): <span className="code-hl">{bitmaskState.p2Mask}</span></div>
                  <div className="bitmask-result">Bitwise AND Operation: <span className="code-success">{bitmaskState.overlap}</span></div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Result Banner */}
          <AnimatePresence>
            {simulationResult && (
              <motion.div
                className={`arch-result-banner ${simulationResult.type}`}
                initial={{ opacity: 0, y: 10, scale: 0.96 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0 }}
              >
                {simulationResult.type === 'success' ? (
                  <CheckCircle2 size={20} className="res-icon" />
                ) : (
                  <AlertCircle size={20} className="res-icon" />
                )}
                <div>
                  <span className="res-title mono">{simulationResult.title}</span>
                  <p className="res-desc">{simulationResult.details}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Live Spring Boot Microservices Telemetry Log */}
          <div className="arch-terminal-wrap">
            <div className="arch-terminal-header">
              <div className="arch-term-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <span className="arch-term-title mono">
                spring-cloud-bus · eureka:8761 · feign-interceptor-trace
              </span>
              <span className="arch-term-mode mono">
                {isRunning ? 'EXECUTION IN PROGRESS...' : 'STANDBY'}
              </span>
            </div>
            <div ref={logContainerRef} className="arch-terminal-body mono">
              {logs.map((log, i) => (
                <div key={i} className={`arch-log-line log-${log.type}`}>
                  <span className="log-time">[{log.time}]</span>
                  <span className="log-svc">[{log.service}]</span>
                  <span className="log-text">{log.message}</span>
                </div>
              ))}
              {isRunning && (
                <div className="arch-log-line log-cursor">
                  <span className="log-prompt">&gt;</span>
                  <span className="arch-blinking-cursor">_</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

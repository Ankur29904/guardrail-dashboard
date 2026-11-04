import type { Scenario_Data } from './types';

export const SCENARIOS: Record<'vulnerable' | 'clean', Scenario_Data> = {
  vulnerable: {
    prNumber: 104,
    prTitle: 'Add user auth & SQL query handler',
    prBranch: 'feature/user-auth-sql',
    prAuthor: 'dev-ankur',
    prFile: 'auth/login_service.py',
    tokenSavings: '73.4%',
    ingestionLatency: '184 ms',
    diffLines: [
      { type: 'header', content: '@@ -1,8 +1,32 @@ auth/login_service.py' },
      { type: 'context', content: ' import hashlib', lineNo: 1 },
      { type: 'context', content: ' import sqlite3', lineNo: 2 },
      { type: 'context', content: ' from flask import request, jsonify', lineNo: 3 },
      { type: 'context', content: ' ', lineNo: 4 },
      { type: 'added', content: '+AWS_SECRET_KEY = "AKIAIOSFODNN7EXAMPLE/wJalrXUtn"', lineNo: 5, isVulnerable: true },
      { type: 'added', content: '+DB_HOST = "prod-db.internal.corp:5432"', lineNo: 6 },
      { type: 'added', content: '+', lineNo: 7 },
      { type: 'added', content: '+def authenticate_user(username: str, password: str):', lineNo: 8 },
      { type: 'added', content: '+    conn = sqlite3.connect("users.db")', lineNo: 9 },
      { type: 'added', content: '+    cursor = conn.cursor()', lineNo: 10 },
      { type: 'added', content: '+    # TODO: fix this later — direct string interpolation', lineNo: 11 },
      { type: 'added', content: '+    query = f"SELECT * FROM users WHERE username=\'{username}\'"', lineNo: 12, isVulnerable: true },
      { type: 'added', content: '+    cursor.execute(query)', lineNo: 13, isVulnerable: true },
      { type: 'added', content: '+    result = cursor.fetchone()', lineNo: 14 },
      { type: 'added', content: '+    if result and result[2] == hashlib.md5(password.encode()).hexdigest():', lineNo: 15, isVulnerable: true },
      { type: 'added', content: '+        token = "fake-jwt-token-12345"', lineNo: 16, isVulnerable: true },
      { type: 'added', content: '+        return jsonify({"status": "ok", "token": token})', lineNo: 17 },
      { type: 'added', content: '+    return jsonify({"status": "unauthorized"}), 401', lineNo: 18 },
      { type: 'added', content: '+', lineNo: 19 },
      { type: 'added', content: '+def get_all_users():', lineNo: 20 },
      { type: 'added', content: '+    conn = sqlite3.connect("users.db")', lineNo: 21 },
      { type: 'added', content: '+    cursor = conn.cursor()', lineNo: 22 },
      { type: 'added', content: '+    for user in cursor.execute("SELECT * FROM users"):', lineNo: 23 },
      { type: 'added', content: '+        process_user(user)   # N+1 query pattern', lineNo: 24, isVulnerable: true },
      { type: 'removed', content: '-def old_login(u, p):', lineNo: 25 },
      { type: 'removed', content: '-    return check_db(u, p)', lineNo: 26 },
    ],
    sastFindings: [
      { tool: 'Semgrep', severity: 'CRITICAL', cwe: 'CWE-89', message: 'SQL Injection via f-string interpolation in cursor.execute()', line: 13, rule: 'python.lang.security.audit.formatted-sql-query' },
      { tool: 'Bandit', severity: 'CRITICAL', cwe: 'CWE-798', message: 'Hardcoded AWS credential detected: AKIAIOSFODNN7EXAMPLE', line: 5, rule: 'B105 / B106' },
      { tool: 'Bandit', severity: 'WARNING', cwe: 'CWE-327', message: 'Use of MD5 for password hashing — broken cryptographic algorithm', line: 15, rule: 'B303' },
      { tool: 'Semgrep', severity: 'WARNING', cwe: 'CWE-200', message: 'Hardcoded fake JWT token string exposed in source', line: 16, rule: 'python.secrets.hardcoded-token' },
    ],
    astNodes: [
      'FunctionDef: authenticate_user (line 8)',
      '  Call: sqlite3.connect → StringLiteral',
      '  Call: cursor.execute → JoinedStr (f-string) ⚠',
      '  Assign: query ← FormatSpec(username) ⚠',
      '  Call: hashlib.md5 → deprecated ⚠',
      'FunctionDef: get_all_users (line 20)',
      '  For: cursor.execute loop → N+1 pattern ⚠',
      'Assign: AWS_SECRET_KEY ← StringLiteral ⚠',
    ],
    agentFindings: {
      security: {
        findings: [
          'CRITICAL: SQL Injection — CWE-89 (OWASP A03:2021)',
          'CRITICAL: Hardcoded AWS credential in source (CWE-798)',
          'HIGH: MD5 password hashing — broken (CWE-327)',
          'HIGH: Hardcoded JWT token — secrets in code (CWE-200)',
          'Recommendation: Use parameterized queries, secrets manager, bcrypt',
        ],
        confidence: 97,
        severity: 'critical',
      },
      performance: {
        findings: [
          'HIGH: N+1 query pattern in get_all_users() — O(n) DB calls',
          'MEDIUM: No connection pooling — sqlite3 opened per request',
          'LOW: fetchone() result not cached — redundant I/O',
          'Suggestion: Batch query with WHERE IN (...) + connection pool',
        ],
        confidence: 88,
        severity: 'high',
      },
      architect: {
        findings: [
          'MEDIUM: Database logic mixed with HTTP handler (SRP violation)',
          'MEDIUM: No repository/service layer abstraction',
          'LOW: Magic string literals scattered — no config module',
          'Suggestion: Extract UserRepository, inject via DI container',
        ],
        confidence: 82,
        severity: 'medium',
      },
      style: {
        findings: [
          'LOW: Missing type hints on cursor.execute() result',
          'LOW: TODO comment left in production path (line 11)',
          'INFO: Function get_all_users missing docstring',
          'INFO: Variable name "u", "p" too terse in old code',
        ],
        confidence: 95,
        severity: 'low',
      },
    },
    consensusTrace: [
      'Aggregating 4 agent critiques...',
      'De-duplicating: SQL Injection flagged by both Security + SAST → unified finding',
      'Resolving conflict: Performance severity (HIGH) vs Security severity (CRITICAL) → escalate to CRITICAL',
      'Calibrating: 2 CRITICAL findings require mandatory block',
      'Consensus threshold: BLOCK (≥1 CRITICAL finding active)',
      'Generating GitHub Markdown comment...',
      'Posting commit status: failure → merge BLOCKED',
    ],
    githubComment: `## 🛡️ GuardRail.AI — Automated PR Security Audit

> **PR #104** · \`feature/user-auth-sql\` → \`main\` · Reviewed by Multi-Agent Mesh v2.1

---

### 📊 Executive Summary

| Dimension | Severity | Agent | Confidence |
|-----------|----------|-------|------------|
| SQL Injection (CWE-89) | 🔴 **CRITICAL** | Security Sentinel | 97% |
| Hardcoded AWS Secret (CWE-798) | 🔴 **CRITICAL** | Security Sentinel | 97% |
| MD5 Password Hash (CWE-327) | 🟠 HIGH | Security Sentinel | 94% |
| N+1 Query Pattern | 🟠 HIGH | Performance Critic | 88% |
| SRP Architecture Violation | 🟡 MEDIUM | Design Architect | 82% |

---

### 🔴 Critical — Must Fix Before Merge

**[Line 13]** \`cursor.execute(query)\` — **SQL Injection via f-string**
\`\`\`python
# ❌ VULNERABLE
query = f"SELECT * FROM users WHERE username='{username}'"
cursor.execute(query)

# ✅ FIX — Use parameterized query
cursor.execute("SELECT * FROM users WHERE username=?", (username,))
\`\`\`

**[Line 5]** \`AWS_SECRET_KEY = "AKIAIOSFODNN7EXAMPLE/..."\` — **Hardcoded Credential**
\`\`\`python
# ❌ VULNERABLE — Remove immediately, rotate this key
# ✅ FIX — Use AWS Secrets Manager or env variable
import os
AWS_SECRET_KEY = os.environ["AWS_SECRET_KEY"]
\`\`\`

---

### 🤖 Agents · LangGraph Parallel Mesh · GuardRail.AI v2.1`,
    mergeStatus: 'blocked',
  },

  clean: {
    prNumber: 105,
    prTitle: 'Refactor caching layer & AST parser optimisation',
    prBranch: 'perf/cache-refactor',
    prAuthor: 'dev-priya',
    prFile: 'core/cache_manager.py',
    tokenSavings: '81.2%',
    ingestionLatency: '147 ms',
    diffLines: [
      { type: 'header', content: '@@ -1,15 +1,38 @@ core/cache_manager.py' },
      { type: 'context', content: ' from typing import Optional, Any, Dict', lineNo: 1 },
      { type: 'context', content: ' import redis', lineNo: 2 },
      { type: 'context', content: ' import json', lineNo: 3 },
      { type: 'context', content: ' import logging', lineNo: 4 },
      { type: 'added', content: '+from functools import wraps', lineNo: 5 },
      { type: 'added', content: '+from datetime import timedelta', lineNo: 6 },
      { type: 'added', content: '+', lineNo: 7 },
      { type: 'added', content: '+logger = logging.getLogger(__name__)', lineNo: 8 },
      { type: 'added', content: '+', lineNo: 9 },
      { type: 'added', content: '+class CacheManager:', lineNo: 10 },
      { type: 'added', content: '+    """Thread-safe Redis cache with LRU eviction and TTL."""', lineNo: 11 },
      { type: 'added', content: '+', lineNo: 12 },
      { type: 'added', content: '+    def __init__(self, host: str, port: int = 6379, db: int = 0) -> None:', lineNo: 13 },
      { type: 'added', content: '+        self._client = redis.Redis(host=host, port=port, db=db, decode_responses=True)', lineNo: 14 },
      { type: 'added', content: '+        self._prefix = "guardrail:"', lineNo: 15 },
      { type: 'added', content: '+', lineNo: 16 },
      { type: 'added', content: '+    def get(self, key: str) -> Optional[Any]:', lineNo: 17 },
      { type: 'added', content: '+        """O(1) cache lookup with serialized payload."""', lineNo: 18 },
      { type: 'added', content: '+        raw = self._client.get(f"{self._prefix}{key}")', lineNo: 19 },
      { type: 'added', content: '+        return json.loads(raw) if raw else None', lineNo: 20 },
      { type: 'added', content: '+', lineNo: 21 },
      { type: 'added', content: '+    def set(self, key: str, value: Any, ttl: int = 300) -> None:', lineNo: 22 },
      { type: 'added', content: '+        """Write-through cache with configurable TTL."""', lineNo: 23 },
      { type: 'added', content: '+        self._client.setex(f"{self._prefix}{key}", timedelta(seconds=ttl), json.dumps(value))', lineNo: 24 },
      { type: 'added', content: '+', lineNo: 25 },
      { type: 'added', content: '+    def cache_result(self, ttl: int = 300):', lineNo: 26 },
      { type: 'added', content: '+        """Decorator: memoize function result in Redis."""', lineNo: 27 },
      { type: 'added', content: '+        def decorator(func):', lineNo: 28 },
      { type: 'added', content: '+            @wraps(func)', lineNo: 29 },
      { type: 'added', content: '+            def wrapper(*args, **kwargs):', lineNo: 30 },
      { type: 'added', content: '+                cache_key = f"{func.__name__}:{hash(str(args))}"', lineNo: 31 },
      { type: 'added', content: '+                cached = self.get(cache_key)', lineNo: 32 },
      { type: 'added', content: '+                if cached is not None:', lineNo: 33 },
      { type: 'added', content: '+                    return cached', lineNo: 34 },
      { type: 'added', content: '+                result = func(*args, **kwargs)', lineNo: 35 },
      { type: 'added', content: '+                self.set(cache_key, result, ttl)', lineNo: 36 },
      { type: 'added', content: '+                return result', lineNo: 37 },
      { type: 'added', content: '+            return wrapper', lineNo: 38 },
      { type: 'added', content: '+        return decorator', lineNo: 39 },
      { type: 'removed', content: '-def simple_cache(key, val):', lineNo: 40 },
      { type: 'removed', content: '-    _cache[key] = val  # global dict, no TTL', lineNo: 41 },
    ],
    sastFindings: [],
    astNodes: [
      'ClassDef: CacheManager (line 10)',
      '  FunctionDef: __init__ — typed params ✓',
      '  FunctionDef: get → Optional[Any] ✓',
      '  FunctionDef: set → None, TTL param ✓',
      '  FunctionDef: cache_result → Decorator pattern ✓',
      '    FunctionDef: decorator (closure)',
      '      FunctionDef: wrapper → @wraps preserved ✓',
      'No security-sensitive AST nodes detected ✓',
    ],
    agentFindings: {
      security: {
        findings: [
          'PASS: No SQL injection vectors detected',
          'PASS: No hardcoded credentials in diff',
          'PASS: Redis connection uses host config (no inline secrets)',
          'PASS: No dangerous deserialization (json.loads of controlled input)',
        ],
        confidence: 99,
        severity: 'pass',
      },
      performance: {
        findings: [
          'PASS: O(1) Redis get/set — optimal complexity',
          'PASS: Decorator pattern avoids repeated computation',
          'INFO: Consider connection pooling (redis.ConnectionPool) for high throughput',
          'INFO: TTL default 300s — suitable for most read-heavy workloads',
        ],
        confidence: 93,
        severity: 'pass',
      },
      architect: {
        findings: [
          'PASS: Single Responsibility — CacheManager handles only caching',
          'PASS: Dependency injection via constructor (host, port, db)',
          'PASS: Decorator pattern follows Open/Closed principle',
          'INFO: Consider abstract base class for multi-backend support',
        ],
        confidence: 91,
        severity: 'pass',
      },
      style: {
        findings: [
          'PASS: Full type annotations on all methods',
          'PASS: Docstrings present on all public methods',
          'PASS: @wraps preserves function metadata correctly',
          'PASS: No magic literals — TTL defaults are explicit params',
        ],
        confidence: 98,
        severity: 'pass',
      },
    },
    consensusTrace: [
      'Aggregating 4 agent critiques...',
      'No CRITICAL or HIGH findings across all agents',
      'SAST pre-filter: 0 findings — deterministic pass',
      'Consensus threshold: APPROVE (0 blocking findings)',
      'All quality gates: PASSED ✓',
      'Generating GitHub Markdown comment...',
      'Posting commit status: success → merge APPROVED',
    ],
    githubComment: `## ✅ GuardRail.AI — Automated PR Security Audit

> **PR #105** · \`perf/cache-refactor\` → \`main\` · Reviewed by Multi-Agent Mesh v2.1

---

### 📊 Executive Summary

| Dimension | Status | Agent | Confidence |
|-----------|--------|-------|------------|
| Security Scan | ✅ **PASSED** | Security Sentinel | 99% |
| Performance Analysis | ✅ **PASSED** | Performance Critic | 93% |
| Architecture Review | ✅ **PASSED** | Design Architect | 91% |
| Style Compliance | ✅ **PASSED** | Style Officer | 98% |

---

### 🟢 All Checks Passed

This PR demonstrates excellent engineering practices:
- ✅ Proper cache abstraction with \`CacheManager\` class
- ✅ O(1) complexity for all cache operations  
- ✅ Full type annotations and docstrings
- ✅ Decorator pattern correctly preserves function metadata
- ✅ No security vulnerabilities detected

### 💡 Non-Blocking Suggestions

**[Line 14]** Consider \`redis.ConnectionPool\` for production:
\`\`\`python
pool = redis.ConnectionPool(host=host, port=port, db=db)
self._client = redis.Redis(connection_pool=pool)
\`\`\`

---

### 🤖 Agents · LangGraph Parallel Mesh · GuardRail.AI v2.1`,
    mergeStatus: 'approved',
  },
};


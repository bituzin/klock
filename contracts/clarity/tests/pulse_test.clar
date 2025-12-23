;; PULSE Contract Unit Tests
;; Run with: clarinet test

(use-trait ft-trait 'SP3FBR2AGK5H9QBDH3EEN6DF8EK8JY7RX8QJ5SVTE.sip-010-trait-ft-standard.sip-010-trait)

;; Test: Daily check-in creates user profile
(define-public (test-daily-checkin)
    (begin
        ;; First check-in should succeed
        (unwrap! (contract-call? .pulse daily-checkin) (err u1))
        
        ;; Verify user profile exists
        (let ((profile (unwrap! (contract-call? .pulse get-user-profile tx-sender) (err u2))))
            (asserts! (is-eq (get total-points profile) u50) (err u3))
            (asserts! (is-eq (get current-streak profile) u1) (err u4))
            (ok true)
        )
    )
)

;; Test: Double check-in same day fails
(define-public (test-double-checkin-fails)
    (begin
        ;; First check-in
        (unwrap! (contract-call? .pulse daily-checkin) (err u1))
        
        ;; Second check-in should fail
        (asserts! (is-err (contract-call? .pulse daily-checkin)) (err u2))
        (ok true)
    )
)

;; Test: Update atmosphere quest
(define-public (test-update-atmosphere)
    (begin
        ;; First check-in to create user
        (unwrap! (contract-call? .pulse daily-checkin) (err u1))
        
        ;; Update atmosphere
        (unwrap! (contract-call? .pulse update-atmosphere u5) (err u2))
        
        ;; Verify quest completed
        (asserts! (contract-call? .pulse has-completed-quest-today tx-sender u3) (err u3))
        (ok true)
    )
)

;; Test: Commit message quest
(define-public (test-commit-message)
    (begin
        ;; First check-in
        (unwrap! (contract-call? .pulse daily-checkin) (err u1))
        
        ;; Commit a message
        (unwrap! (contract-call? .pulse commit-message u"Hello PULSE!") (err u2))
        
        ;; Verify message stored
        (let ((msg (unwrap! (contract-call? .pulse get-user-message tx-sender u0) (err u3))))
            (asserts! (is-eq (get content msg) u"Hello PULSE!") (err u4))
            (ok true)
        )
    )
)

;; Test: Predict pulse quest
(define-public (test-predict-pulse)
    (begin
        ;; First check-in
        (unwrap! (contract-call? .pulse daily-checkin) (err u1))
        
        ;; Make prediction
        (unwrap! (contract-call? .pulse predict-pulse u7) (err u2))
        
        ;; Verify quest completed
        (asserts! (contract-call? .pulse has-completed-quest-today tx-sender u9) (err u3))
        (ok true)
    )
)

;; Test: Invalid prediction level fails
(define-public (test-invalid-prediction-fails)
    (begin
        ;; First check-in
        (unwrap! (contract-call? .pulse daily-checkin) (err u1))
        
        ;; Invalid prediction (0) should fail
        (asserts! (is-err (contract-call? .pulse predict-pulse u0)) (err u2))
        
        ;; Invalid prediction (11) should fail
        (asserts! (is-err (contract-call? .pulse predict-pulse u11)) (err u3))
        (ok true)
    )
)

;; Test: Global stats update correctly
(define-public (test-global-stats)
    (begin
        ;; Check-in
        (unwrap! (contract-call? .pulse daily-checkin) (err u1))
        
        ;; Verify global stats
        (let ((stats (contract-call? .pulse get-global-stats)))
            (asserts! (>= (get total-users stats) u1) (err u2))
            (asserts! (>= (get total-checkins stats) u1) (err u3))
            (ok true)
        )
    )
)

;; Test: Contract pause (admin only)
(define-public (test-contract-pause)
    (begin
        ;; Pause contract (only works for contract owner)
        (unwrap! (contract-call? .pulse set-contract-paused true) (err u1))
        
        ;; Verify paused
        (asserts! (contract-call? .pulse is-paused) (err u2))
        
        ;; Unpause
        (unwrap! (contract-call? .pulse set-contract-paused false) (err u3))
        (asserts! (not (contract-call? .pulse is-paused)) (err u4))
        
        (ok true)
    )
)

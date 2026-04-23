# 2026-04-22 Messaging Feature Implementation

## Prompt
Implement UI for messaging feature. Use components prepared by user.

## Actions

### Components implemented
- **MessageComponent** (`message.component.html/scss/ts`): Bubble UI, mine (right/primary) vs bot (left/surface-variant), timestamps via DatePipe
- **MessageListComponent** (`message-list.component.html/scss/ts`): Chat UI with message list, send input (textarea + Enter to send), sending/error/retry states, auto-scroll, initial load on `ngOnInit`
- **BotBubbleComponent** (`bot-bubble.component.html/scss/ts`): Fixed FAB button (Material `mat-fab`) navigates to `right:messages` outlet

### App shell updated
- `app.html`: Replaced plain `<router-outlet name="right">` with `mat-sidenav` (end position, side mode) — opens on outlet activate, closes on deactivate
- `app.scss`: Removed hardcoded `background: white`, replaced with `var(--mat-sys-outline-variant)` for border
- `app.ts`: Added `MatSidenavModule` import

### Bug fixed
- `BotBubbleComponent` originally navigated to `{right: 'message'}` (singular), but route is `messages` (plural). Fixed to `'messages'`.

## Material components used
- `mat-sidenav-container` / `mat-sidenav` for chat panel
- `mat-fab` for bot bubble
- `mat-progress-spinner` for loading states
- `mat-form-field` + `matInput` + `cdkTextareaAutosize` for message input
- `mat-button` for send / retry actions
- `mat-icon` for icons

## Feedback resolution (2026-04-22)

1. **CDK virtual scroll** → Replaced `.messages-area` div with `cdk-virtual-scroll-viewport` + `*cdkVirtualFor`, `itemSize="72"`, `trackBy: trackBySeq`
2. **Auto-scroll** → Kept user's modification (only scroll on sending), replaced `setTimeout` with `timer(200)` (RxJS), use `viewport.scrollToIndex()` instead of raw DOM
3. **Scroll-to-top pagination** → `(scrolledIndexChange)` → calls `onScrollChangeToFirstElement()` when index === 0


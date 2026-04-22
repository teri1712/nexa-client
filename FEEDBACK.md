1. Please use cdk scroll for message list bc out list might large
2. in message list component, i just modified:

   effect(() => {
   // Auto-scroll to bottom when messages change
   const sending = this.sendingMessage();
   if (sending?.status === 'sending') {
   setTimeout(() => {
   const el = this.messagesArea()?.nativeElement;
   if (el) el.scrollTop = el.scrollHeight;
   }, 0);
   }
   });

so that only when user click send a message, it scroll to bottom.

3. please call onScrollChangeToFirstElement hook when first element in message list is reached, so that i can start
   download older messages
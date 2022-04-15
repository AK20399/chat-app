import 'package:states_rebuilder/states_rebuilder.dart';
import 'package:vato/model/message.dart';

final injectedMessages = RM.inject<List<Message>>(
  () => <Message>[],
  autoDisposeWhenNotUsed: false,
  stateInterceptor: (currentSnap, nextSnap) {
    print(
        '⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛ CurrentState:${currentSnap.data?.length} ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛');
    print('⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛ NextState:${nextSnap.data?.length} ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛');
  },
);

final chatMessagesScroll = RM.injectScrolling();

final typingUsers = RM.inject<List<String>>(
  () => [],
  stateInterceptor: (currentSnap, nextSnap) {
    print(
        '⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛ typingUsers > CurrentState:${currentSnap.data?.length} ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛');
    print(
        '⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛typingUsers > NextState:${nextSnap.data?.length} ⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛⬛');
  },
);

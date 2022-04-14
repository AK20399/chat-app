import 'package:states_rebuilder/scr/state_management/rm.dart';

final injectedAppState = RM.inject<AppState>(
  () => AppState(),
  autoDisposeWhenNotUsed: false,
);

class AppState {
  String? _displayName;
  String? _room;

  String? get displayName => _displayName;
  String? get room => _room;

  void setDisplayName(String name) {
    _displayName = name;
  }

  void setRoom(String room) {
    _room = room;
  }
}

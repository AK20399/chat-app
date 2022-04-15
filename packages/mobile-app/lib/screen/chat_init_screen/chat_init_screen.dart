import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:states_rebuilder/scr/state_management/rm.dart';
import 'package:vato/constants/color_constants.dart';
import 'package:vato/screen/chat_screen/store/socket_connection.dart';
import 'package:vato/service/app_state/app_state.dart';
import 'package:vato/widgets/custom_text_field/custom_text_field.dart';

class ChatInitScreen extends StatefulWidget {
  const ChatInitScreen({Key? key}) : super(key: key);

  @override
  State<ChatInitScreen> createState() => _ChatInitScreenState();
}

class _ChatInitScreenState extends State<ChatInitScreen> {
  late TextEditingController _displayNameController;
  late TextEditingController _roomController;
  late FocusNode _displayNameFocusNode;
  late FocusNode _roomFocusNode;
  late FocusNode _joinButtonFocusNode;

  @override
  void initState() {
    super.initState();
    _displayNameController = TextEditingController();
    _roomController = TextEditingController();
    _displayNameFocusNode = FocusNode();
    _roomFocusNode = FocusNode();
    _joinButtonFocusNode = FocusNode();
  }

  @override
  void dispose() {
    _displayNameController.dispose();
    _roomController.dispose();
    _displayNameFocusNode.dispose();
    _roomFocusNode.dispose();
    _joinButtonFocusNode.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return GestureDetector(
      onTap: () {
        FocusScope.of(context).unfocus();
      },
      child: Scaffold(
        backgroundColor: ColorConstants.lightGrey,
        appBar: AppBar(
          backgroundColor: ColorConstants.lightGrey,
          elevation: 0.0,
          centerTitle: true,
          title: Text(
            'Mini Chat',
            style: GoogleFonts.raleway(
              fontSize: 22.0,
              color: ColorConstants.black,
            ),
          ),
        ),
        body: Container(
          padding: const EdgeInsets.symmetric(
            horizontal: 16.0,
          ),
          child: Column(
            mainAxisAlignment: MainAxisAlignment.center,
            crossAxisAlignment: CrossAxisAlignment.center,
            children: [
              CustomTextField(
                hintText: 'Display Name',
                prefixIcon: Icons.person_outline,
                onSubmitted: (_) {
                  _roomFocusNode.requestFocus();
                },
                controller: _displayNameController,
                focusNode: _displayNameFocusNode,
              ),
              const SizedBox(
                height: 16.0,
              ),
              CustomTextField(
                hintText: 'Room',
                prefixIcon: Icons.group_outlined,
                onSubmitted: (_) {
                  _joinButtonFocusNode.requestFocus();
                },
                controller: _roomController,
                focusNode: _roomFocusNode,
              ),
              Padding(
                padding: const EdgeInsets.only(top: 16.0),
                child: ElevatedButton(
                  focusNode: _joinButtonFocusNode,
                  style: ElevatedButton.styleFrom(
                    primary: ColorConstants.purpleLight,
                    padding: const EdgeInsets.symmetric(
                      horizontal: 24.0,
                      vertical: 8.0,
                    ),
                    shape: RoundedRectangleBorder(
                      borderRadius: BorderRadius.circular(18.0),
                    ),
                  ),
                  onPressed: _onPressedJoin,
                  child: Text(
                    'Join',
                    style: GoogleFonts.raleway(
                      fontSize: 24.0,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  Future<void> _onPressedJoin() async {
    try {
      print('_onPressedJoin');
      if (_displayNameController.text.trim().isNotEmpty &&
          _roomController.text.trim().isNotEmpty) {
        socketConnection.state.sendJoinRoomEvent(
          displayName: _displayNameController.text.trim(),
          room: _roomController.text.trim(),
        );

        //set name and room
        injectedAppState.state
            .setDisplayName(_displayNameController.text.trim());
        injectedAppState.state.setRoom(_roomController.text.trim());

        FocusScope.of(context).unfocus();
        _displayNameController.clear();
        _roomController.clear();
        RM.navigate.toNamed('chatScreen/');
      } else {
        String snackBarText = '';

        if (_roomController.text.isEmpty &&
            _displayNameController.text.isEmpty) {
          snackBarText = 'Display name and Room name are required';
        } else {
          snackBarText =
              '${_roomController.text.isEmpty ? 'Room name' : 'Display name'} is required';
        }

        SnackBar snackBar = SnackBar(
          duration: const Duration(seconds: 2),
          content: Text(
            snackBarText,
            style: GoogleFonts.openSans(),
          ),
        );

        RM.scaffold.showSnackBar(snackBar);
      }
    } catch (err) {
      print('_onPressedJoin > error');
      print(err);
    }
  }
}

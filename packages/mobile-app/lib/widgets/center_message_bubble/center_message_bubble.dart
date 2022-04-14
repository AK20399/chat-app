import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:vato/constants/color_constants.dart';

class CenterMessageBubble extends StatelessWidget {
  final String text;

  const CenterMessageBubble({Key? key, required this.text}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Row(
      mainAxisAlignment: MainAxisAlignment.center,
      children: [
        Flexible(
          child: Container(
            padding: const EdgeInsets.symmetric(
              horizontal: 12.0,
              vertical: 8.0,
            ),
            margin: const EdgeInsets.symmetric(vertical: 6.0),
            decoration: BoxDecoration(
              color: ColorConstants.black.withOpacity(0.5),
              borderRadius: BorderRadius.circular(16.0),
            ),
            child: Text(
              text,
              style: GoogleFonts.openSans(
                color: Colors.white,
                letterSpacing: 1.5,
              ),
              textAlign: TextAlign.center,
            ),
          ),
        ),
      ],
    );
  }
}

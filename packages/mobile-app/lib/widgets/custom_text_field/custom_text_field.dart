import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:vato/constants/color_constants.dart';

class CustomTextField extends StatelessWidget {
  final FocusNode? focusNode;
  final TextEditingController? controller;
  final ValueChanged<String>? onSubmitted;
  final String hintText;
  final IconData prefixIcon;

  const CustomTextField({
    Key? key,
    this.focusNode,
    this.controller,
    this.onSubmitted,
    required this.hintText,
    required this.prefixIcon,
  }) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return TextField(
      focusNode: focusNode,
      controller: controller,
      onSubmitted: onSubmitted,
      textInputAction: TextInputAction.done,
      style: GoogleFonts.raleway(
        color: Colors.white,
        fontSize: 18.0,
      ),
      cursorColor: Colors.white,
      textAlignVertical: TextAlignVertical.center,
      decoration: InputDecoration(
        contentPadding: const EdgeInsets.symmetric(
          vertical: 18.0,
        ),
        prefixIconConstraints: const BoxConstraints(
          minWidth: 58.0,
        ),
        border: OutlineInputBorder(
          borderRadius: BorderRadius.circular(12.0),
          borderSide: BorderSide.none,
        ),
        hintStyle: GoogleFonts.raleway(
          color: ColorConstants.purpleLight,
          fontSize: 18.0,
        ),
        hintText: hintText,
        filled: true,
        fillColor: ColorConstants.textFieldDark,
        prefixIcon: Icon(
          prefixIcon,
          color: Colors.white,
        ),
        alignLabelWithHint: true,
      ),
    );
  }
}

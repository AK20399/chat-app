import 'package:json_annotation/json_annotation.dart';

part 'message.g.dart';

@JsonSerializable(includeIfNull: false)
class Message {
  final int? createdAt;
  final String? text;
  final String? username;

  Message({
    this.username,
    this.createdAt,
    this.text,
  });

  factory Message.fromJson(Map<String, dynamic> json) =>
      _$MessageFromJson(json);

  Map<String, dynamic> toJson() => _$MessageToJson(this);
}

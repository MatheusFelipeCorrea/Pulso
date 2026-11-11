/// Aligns with web `repairWikiThumbUrl` — some 420px Commons thumbs 403.
String? repairWikiThumbUrl(String? url) {
  if (url == null || url.isEmpty) return url;
  if (!url.contains('/420px-')) return url;
  return url.replaceFirst('/420px-', '/330px-');
}

String? shrinkWikiThumbUrl(String? url, {int maxWidth = 220}) {
  if (url == null || url.isEmpty) return url;
  final match = RegExp(r'/(\d+)px-').firstMatch(url);
  if (match == null) return url;
  final current = int.tryParse(match.group(1)!);
  if (current == null || maxWidth >= current) return url;
  return url.replaceFirst(RegExp(r'/\d+px-'), '/${maxWidth}px-');
}

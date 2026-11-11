double roundMoney(num value) =>
    (value * 100).roundToDouble() / 100;

List<double> splitEqual(num valorTotal, int n) {
  if (n <= 0) return const [];
  final totalCentavos = (valorTotal * 100).round();
  final baseCentavos = totalCentavos ~/ n;
  final resto = totalCentavos - baseCentavos * n;
  return List<double>.generate(n, (index) {
    final centavos = index < resto ? baseCentavos + 1 : baseCentavos;
    return roundMoney(centavos / 100);
  });
}

bool validarSomaPersonalizada(num valorTotal, List<num> valores) {
  final somaCentavos =
      valores.fold<int>(0, (acc, valor) => acc + (valor * 100).round());
  final totalCentavos = (valorTotal * 100).round();
  return somaCentavos == totalCentavos;
}

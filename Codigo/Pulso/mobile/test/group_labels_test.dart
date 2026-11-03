import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:pulso/features/groups/data/group_models.dart';
import 'package:pulso/features/groups/utils/group_labels.dart';

void main() {
  test('limpa sufixo de modo e marca o proprio membro', () {
    expect(
      limparNomeGrupoMembro('  Ana (admin)  Silva   pessoa física  '),
      'Ana Silva',
    );
    expect(limparNomeGrupoMembro(null), '');
    expect(
      formatGrupoMembroDisplayNome('Carla CLT', souEu: true),
      'Carla (você)',
    );
    expect(formatGrupoMembroDisplayNome('Diego'), 'Diego');
    expect(formatCodigoConvite(' pulso-ab12 '), 'PULSO-AB12');
    expect(formatCodigoConvite(null), '');
  });

  test('rotula atividade e papel como na web', () {
    final agora = DateTime(2026, 10, 23, 12);
    expect(groupActivityLabel(null), 'Sem atividade recente');
    expect(groupActivityLabel('nao-data'), 'Sem atividade recente');
    expect(
      groupActivityLabel('2026-10-23T11:50:00', agora: agora),
      'Há 10 min',
    );
    expect(groupActivityLabel('2026-10-22T12:00:00', agora: agora), 'Há 1 dia');
    expect(groupPapelVisual('ADMIN').label, 'Admin');
    expect(groupPapelVisual('ADMIN').icon, Icons.shield_outlined);
    expect(groupPapelVisual('MEMBRO').admin, isFalse);
    expect(groupPapelVisual(null).label, 'Membro');
  });

  test('modelo de grupo lê resumo e detalhe da API', () {
    final grupo = PulsoGrupo.fromJson({
      'id': 'g1',
      'nome': 'República',
      'descricao': 'Contas da casa',
      'codigoConvite': 'PULSO-AB12',
      'meuPapel': 'ADMIN',
      'quantidadeMembros': 2,
      'imagemExibicao': 'https://cdn.example/capa.jpg',
      'ultimaAtividade': '2026-10-20T10:00:00.000Z',
      'membrosPreview': [
        {'id': 'u1', 'nome': 'Ana CLT', 'papel': 'ADMIN', 'souEu': true},
      ],
      'membros': [
        {'id': 'u1', 'nome': 'Ana CLT', 'papel': 'ADMIN', 'souEu': true},
        {'id': 'u2', 'nome': 'Bruno', 'papel': 'MEMBRO', 'souEu': false},
      ],
      'viagem': {
        'id': 'v1',
        'destino': 'Ouro Preto',
        'moeda': 'BRL',
        'totalGrupo': '400.00',
      },
      'meta': {
        'nome': 'Caução',
        'valorAlvo': '1000.00',
        'valorAtual': '250.00',
        'percentual': 25,
        'status': 'ATIVA',
      },
    });

    expect(grupo.isAdmin, isTrue);
    expect(grupo.capa, 'https://cdn.example/capa.jpg');
    expect(grupo.pessoas, hasLength(2));
    expect(grupo.viagem?.destino, 'Ouro Preto');
    expect(grupo.meta?.percentual, 25);
    expect(grupo.quantidadeMembros, 2);
  });
}

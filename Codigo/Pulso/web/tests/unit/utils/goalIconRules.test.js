import { describe, expect, it } from 'vitest'
import {
  Bike,
  BookOpen,
  Car,
  GraduationCap,
  Home,
  Laptop,
  PawPrint,
  PiggyBank,
  Plane,
  Target,
} from 'lucide-react'
import { getGoalIcon } from '@/utils/goalIconRules.js'

describe('getGoalIcon', () => {
  it('usa avião para viagens', () => {
    expect(getGoalIcon('Viagem para Macaé')).toBe(Plane)
    expect(getGoalIcon('passagem aérea europa')).toBe(Plane)
  })

  it('usa carro para veículos', () => {
    expect(getGoalIcon('Carro novo')).toBe(Car)
    expect(getGoalIcon('Comprar automóvel')).toBe(Car)
  })

  it('usa moto/bike para motocicletas', () => {
    expect(getGoalIcon('Trocar de Moto')).toBe(Bike)
    expect(getGoalIcon('Bicicleta elétrica')).toBe(Bike)
  })

  it('cobre educação, moradia e tecnologia', () => {
    expect(getGoalIcon('Faculdade')).toBe(GraduationCap)
    expect(getGoalIcon('Curso de inglês')).toBe(BookOpen)
    expect(getGoalIcon('Entrada da Casa Própria')).toBe(Home)
    expect(getGoalIcon('Novo Notebook')).toBe(Laptop)
  })

  it('cobre reserva e pets', () => {
    expect(getGoalIcon('Reserva de emergência')).toBe(PiggyBank)
    expect(getGoalIcon('Vacina do cachorro')).toBe(PawPrint)
  })

  it('usa alvo quando não há correspondência', () => {
    expect(getGoalIcon('testee')).toBe(Target)
    expect(getGoalIcon('')).toBe(Target)
  })
})

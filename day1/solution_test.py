from solution import greediest_elf_calorie_count, top_three_greediest_elf_calorie_count


def test_greediest_elf_calorie_count():
    result = greediest_elf_calorie_count('./input.txt')
    print(result)


def test_top_three_greediest_elf_calorie_count():
    result = top_three_greediest_elf_calorie_count('./input.txt')
    print(result)
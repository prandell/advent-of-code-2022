from solution import strategy_guide_total_score_part1, strategy_guide_total_score_part2


def test_strategy_guide_total_score():
    result = strategy_guide_total_score_part1('./input.txt')
    print(result)
    result = strategy_guide_total_score_part2('./input.txt')
    print(result)

def helper1(suggested_move, opponent_move):
    return 1


def part1(filename):
    # Using readlines()
    file = open(filename, 'r')
    lines = file.readlines()

    # Variable initilisation
    total_score = 0

    # Strips the newline character
    for line in lines:
        line_content = line.strip()
        if (line_content == '' or line_content is None):
            continue
        else:
            opponent_move = line_content[0]
            suggested_move = line_content[2]
            total_score += helper1(opponent_move, suggested_move)
    return total_score

def part2(filename):
    # Using readlines()
    file = open(filename, 'r')
    lines = file.readlines()

    # Variable initilisation
    total_score = 0

    # Strips the newline character
    for line in lines:
        line_content = line.strip()
        if (line_content == '' or line_content is None):
            continue
        else:
            opponent_move = line_content[0]
            suggested_move = line_content[2]
            total_score += suggested_outcome_round_score(opponent_move, suggested_move)
    return total_score

def greediest_elf_calorie_count(filename):
    # Using readlines()
    file = open(filename, 'r')
    lines = file.readlines()

    # Variable initilisation
    new_line_count = 0
    elf_calorie_count = 0
    greediest_elf_calorie_count = 0
    line_content = ''

    # Strips the newline character
    for line in lines:
        line_content = line.strip()
        if (line_content == '' or line_content is None):
            if (elf_calorie_count > greediest_elf_calorie_count):
                greediest_elf_calorie_count = elf_calorie_count
            elf_calorie_count = 0
        elif (line_content is not None):
            elf_calorie_count += int(line_content)
    return greediest_elf_calorie_count


def top_three_greediest_elf_calorie_count(filename):
    # Using readlines()
    file = open(filename, 'r')
    lines = file.readlines()

    # Variable initilisation
    new_line_count = 0
    elf_calorie_count = 0
    top_three_greediest_elf_calorie_counts = []
    line_content = ''

    # Strips the newline character
    for line in lines:
        line_content = line.strip()
        if (line_content == '' or line_content is None):
            top_three_greediest_elf_calorie_counts.append(elf_calorie_count)
            top_three_greediest_elf_calorie_counts.sort()
            # Removes the smallest element after sorting
            if (len(top_three_greediest_elf_calorie_counts) > 3):
                top_three_greediest_elf_calorie_counts.pop(0)
            elf_calorie_count = 0
        elif (line_content is not None):
            elf_calorie_count += int(line_content)
    return sum(top_three_greediest_elf_calorie_counts)

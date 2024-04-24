import pygame
from models import GameObject
from utils import load_sprite
class SpaceGame:
    def __init__(self):
        self._init_pygame()
        self.screen = pygame.display.set_mode((800, 600))
        self.background = load_sprite("Starfield_01-1024x1024", False)
        self.player = GameObject((400, 300), load_sprite("ship_sidesA"), (0, 0))
        self.enemies = [
            GameObject((100, 100), load_sprite("enemy_A"), (1, 0)),
            GameObject((200, 100), load_sprite("enemy_B"), (1, 0)),
            GameObject((300, 100), load_sprite("enemy_C"), (1, 0)),
        ]

    def main_loop(self):
        while True:
            self._handle_input()
            self._process_game_logic()
            self._draw()

    def _init_pygame(self):
        pygame.init()
        pygame.display.set_caption("Space Game")

    def _handle_input(self):
        for event in pygame.event.get():
            if event.type == pygame.QUIT or (
                event.type == pygame.KEYDOWN and event.key == pygame.K_ESCAPE
            ):
                quit()

    def _process_game_logic(self):
        pass

    def _draw(self):
        self.screen.blit(self.background, (0, 0))
        self.player.draw(self.screen)
        for enemy in self.enemies:
            enemy.draw(self.screen)
        pygame.display.flip()